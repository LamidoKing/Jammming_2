import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import Profile from '../Profile/Profile';
import PlaylistList from '../PlaylistList/PlaylistList';
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			SearchResults: [],
			playlistName: 'New playlist',
			playlistTracks: [],
			playlistId: null,
			connected: '',
			playlistList: [],
			profileImage: ''
		};
		this.addTrack = this.addTrack.bind(this);
		this.removeTrack = this.removeTrack.bind(this);
		this.updatePlaylistName = this.updatePlaylistName.bind(this);
		this.savePlaylist = this.savePlaylist.bind(this);
		this.search = this.search.bind(this);
		this.connect = this.connect.bind(this);
		this.disconnect = this.disconnect.bind(this);
		this.getUserPlayLists = this.getUserPlayLists.bind(this);
		this.switchPlaylist = this.switchPlaylist.bind(this);
		this.deletePlaylist = this.deletePlaylist.bind(this);
	}

	componentDidMount() {
		Spotify.getAccessToken();
		this.getUserPlayLists();
		this.updatePlaylistId();
	}
	componentDidUpdate() {
		this.getUserPlayLists();
	}

	addTrack(track) {
		let tracks = this.state.playlistTracks;
		if (tracks.find((savedTrack) => savedTrack.id === track.id)) {
		} else {
			tracks.push(track);
			this.setState({ playlistTracks: tracks });
		}
	}

	removeTrack(track) {
		this.setState({
			playlistTracks: this.state.playlistTracks.filter((playlistItem) => playlistItem.id !== track.id)
		});
	}

	updatePlaylistName(name) {
		if (this.playlistName !== name) {
			this.setState({ playlistName: name });
		}
	}

	savePlaylist() {
		let trackURIs = this.state.playlistTracks.map((track) => track.uri);
		Spotify.savePlaylist(this.state.playlistName, trackURIs, this.state.playlistId).then(() => {
			this.setState({
				playlistName: 'New playlist',
				searchResults: [],
				playlistTracks: [],
				playlistId: null
			});
		});
	}

	search(term) {
		Spotify.search(term).then((tracks) => {
			this.setState({
				searchResults: tracks
			});
		});
	}

	connect() {
		Spotify.connect().then((response) => {
			if (response.id) {
				this.setState({
					connected: response.display_name,
					profileImage: []
				});
			}
		});
	}

	disconnect() {
		Spotify.disconnect();
		window.location.reload();
	}

	getUserPlayLists() {
		Spotify.getUserPlayLists().then((playlists) => {
			this.setState({
				playlistList: playlists
			});
		});
	}

	updatePlaylistId(playlistId) {
		this.setState({ playlistId: playlistId });
	}

	switchPlaylist(playlistItem) {
		if (this.state.playlistId === playlistItem.playlistId) {
			return this.setState({
				playlistName: '',
				playlistId: null,
				playlistTracks: []
			});
		}
		this.updatePlaylistId(playlistItem.playlistId);
		this.updatePlaylistName(playlistItem.playlistName);
		Spotify.getPlaylistTracks(playlistItem.playlistId).then((tracks) => {
			this.setState({ playlistTracks: tracks, savedTracks: tracks.slice(0) });
		});
	}

	deletePlaylist(playlist) {
		Spotify.deletePlaylistById(playlist.playlistId);

		Spotify.getUserPlayLists().then((playlists) => {
			this.setState({
				playlistList: playlists
			});
		});
	}

	render() {
		return (
			<div>
				<h1>
					Ja<span className="highlight">mmm</span>ing
				</h1>
				<div className="App">
					<Profile
						onConnect={this.connect}
						onDisconnect={this.disconnect}
						connected={this.state.connected}
						imageUrl={this.state.profileImage}
					/>
					<SearchBar onSearch={this.search} />

					<div className="App-playlist">
						<SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />

						<Playlist
							playlistName={this.state.playlistName}
							playlistTracks={this.state.playlistTracks}
							onRemove={this.removeTrack}
							onNameChange={this.updatePlaylistName}
							onSave={this.savePlaylist}
						/>
					</div>

					<PlaylistList
						getUserPlayLists={this.getUserPlayLists}
						onEdit={this.switchPlaylist}
						playlistList={this.state.playlistList}
						deletePlaylist={this.deletePlaylist}
					/>
				</div>
			</div>
		);
	}
}

export default App;
