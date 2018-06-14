import React, { Component } from 'react';
import './PlaylistList.css';
import PlaylistListItem from '../PlaylistListItem/PlaylistListItem';

class PlaylistList extends Component {
	componentDidMount() {
		this.props.getUserPlayLists();
	}

	render() {
		return (
			<div className="PlaylistList">
				<h2>Local PlayLists</h2>
				{this.props.playlistList.map((playlistItem) => {
					return (
						<PlaylistListItem
							playlistItem={playlistItem}
							key={playlistItem.playlistId}
							onEdit={this.props.onEdit}
							deletePlaylist={this.props.deletePlaylist}
						/>
					);
				})}
			</div>
		);
	}
}

export default PlaylistList;
