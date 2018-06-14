let accessToken;
const clientId = '01c010bd40af4bd8bae96e662488dc9d';
const redirectURI = 'http://lamido.surge.sh/';
let expires_in;
let userId;

let Spotify = {
	getAccessToken() {
		const checkAccessToken = window.location.href.match(/access_token=([^&]*)/);
		if (accessToken) {
			return accessToken;
		} else if (checkAccessToken) {
			accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
			expires_in = window.location.href.match(/expires_in=([^&]*)/)[1];
			window.setTimeout(() => (accessToken = ''), expires_in * 1000);
			window.history.pushState('Access Token', null, '/');
			return accessToken;
		} else {
			window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
		}
	},

	search(term) {
		return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, this.fetchmethod('GET'))
			.then(this.response())
			.then((jsonResponse) => {
				if (jsonResponse) {
					return jsonResponse.tracks.items.map((track) => {
						return {
							id: track.id,
							name: track.name,
							artist: track.artists[0].name,
							album: track.album.name,
							cover: track.album.images[2].url,
							uri: track.uri
						};
					});
				} else {
					return [];
				}
			});
	},

	savePlaylist(playlistName, tracks, playlistId) {
		if (playlistName && tracks.length > 0) {
			return this.getCurrentUserId().then(() => {
				if (playlistId) {
					// Playlist ID existed / need to update
					this.updatePlaylistName(playlistId, playlistName);
				} else {
					let body = JSON.stringify({ name: playlistName });
					return fetch(`https://api.spotify.com/v1/users/${userId.id}/playlists`, this.fetchmethodPOST(body))
						.then(this.response())
						.then((jsonResponse) => {
							let body = JSON.stringify({ uris: tracks });
							return fetch(
								`https://api.spotify.com/v1/users/${userId.id}/playlists/${jsonResponse.id}/tracks`,
								this.fetchmethodPOST(body)
							).then(this.response());
						});
				}
			});
		} else {
			return;
		}
	},

	getCurrentUserId() {
		return fetch('https://api.spotify.com/v1/me', this.fetchmethod('GET'))
			.then(this.response())
			.then((jsonResponse) => {
				userId = jsonResponse;
			});
	},

	connect() {
		return this.getCurrentUserId().then(() => {
			if (!userId.id) {
				return '';
			}
			return userId;
		});
	},

	disconnect() {
		if (accessToken) {
			window.setTimeout(() => (accessToken = ''), 0);
		}
	},

	getUserPlayLists() {
		return this.getCurrentUserId().then(() =>
			fetch(`https://api.spotify.com/v1/users/${userId.id}/playlists`, this.fetchmethod('GET'))
				.then(this.response())
				.then((jsonResponse) => {
					if (!jsonResponse.items) {
						return [];
					} else {
						return jsonResponse.items.map((item) => ({
							playlistId: item.id,
							playlistName: item.name
						}));
					}
				})
		);
	},

	getPlaylistTracks(playlistId) {
		return this.getCurrentUserId().then(() =>
			fetch(
				`https://api.spotify.com/v1/users/${userId.id}/playlists/${playlistId}/tracks`,
				this.fetchmethod('GET')
			)
				.then(this.response())
				.then((jsonResponse) => {
					if (!jsonResponse.items) {
						return [];
					} else {
						return jsonResponse.items.map((item) => ({
							id: item.track.id,
							name: item.track.name,
							artist: item.track.album.artists[0].name,
							image: item.track.album.images[2].url,
							album: item.track.album.name,
							uri: item.track.uri
						}));
					}
				})
		);
	},

	updatePlaylistName(playlistId, playlistName) {
		let body = JSON.stringify({ name: playlistName });
		return Spotify.getCurrentUserId()
			.then(() =>
				fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}`, this.fetchmethodPOST(body))
			)
			.then(this.response());
	},

	deletePlaylistById(playlistId) {
		return this.getCurrentUserId().then((userId) => {
			return fetch(
				`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/followers`,
				this.fetchmethod('DELETE')
			);
		});
	},

	response() {
		return (response) => {
			if (response.ok) {
				return response.json();
			}
		};
	},

	fetchmethod(method) {
		return {
			method: method,
			headers: {
				Authorization: `Bearer ${this.getAccessToken()}`,
				'Content-Type': 'application/json'
			}
		};
	},

	fetchmethodPOST(body) {
		return {
			headers: {
				Authorization: `Bearer ${this.getAccessToken()}`,
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: body
		};
	}
};

export default Spotify;
