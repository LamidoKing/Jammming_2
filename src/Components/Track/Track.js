import React from 'react';
import './Track.css';

class Track extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			toggle: false,
			toggleName: 'Player'
		};
		this.addTrack = this.addTrack.bind(this);
		this.removeTrack = this.removeTrack.bind(this);
		this.renderAction = this.renderAction.bind(this);
		this.previewIcon = this.previewIcon.bind(this);

		this.onDetails = this.onDetails.bind(this);
	}

	renderAction() {
		if (this.props.isRemoval === true) {
			return (
				<a className="Track-action" onClick={this.removeTrack}>
					-
					</a>
			);
		} else {
			return (
				<a className="Track-action" onClick={this.addTrack}>
					+
				</a>
			);
		}
	}
	addTrack() {
		this.props.onAdd(this.props.track);
	}

	removeTrack() {
		this.props.onRemove(this.props.track);
	}

	onDetails() {
		if (this.state.toggle === true) {
			this.setState({
				toggle: false,
				toggleName: 'Player'
			});
		} else {
			this.setState({
				toggle: true,
				toggleName: 'Detail'
			});
		}
	}

	previewIcon() {
		if (this.state.toggle) {
			return (
				<div>
					<iframe
						title={this.props.track.name}
						src={`https://open.spotify.com/embed?uri=spotify:track:${this.props.track.id}`}
						frameBorder="0"
						allowTransparency="true"
						height="80"
					/>
				</div>
			);
		} else {
			return (
				<div className="Track-information">
					<h3>{this.props.track.name}</h3>
					<p>
						{this.props.track.artist} | {this.props.track.album}
					</p>
				</div>
			);
		}
	}

	render() {
		return (
			<div className="Track">
				

				{this.previewIcon()}
				<a className="Toggle-action" onClick={this.onDetails}>
					{this.state.toggleName}
				</a>
				<a className="Track-action">{this.renderAction()}</a>
			</div>
		);
	}
}

export default Track;
