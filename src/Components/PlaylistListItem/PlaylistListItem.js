import React, { Component } from 'react';
import './PlaylistListItem.css';

class PlaylistListItem extends Component {
	constructor(props) {
		super(props);
		this.editPlaylist = this.editPlaylist.bind(this);
		this.delete = this.delete.bind(this);
	}

	editPlaylist() {
		this.props.onEdit(this.props.playlistItem);
	}

	delete() {
		this.props.deletePlaylist(this.props.playlistItem);
	}

	render() {
		return (
			<div className="PlaylistItem">
				<div onClick={this.editPlaylist} className="PlaylistItem-information">
					<h3>{this.props.playlistItem.playlistName}</h3>
				</div>

				<div>
					<a className="PlaylistItem-action" onClick={this.delete}>
						Delete
					</a>
				</div>
			</div>
		);
	}
}

export default PlaylistListItem;
