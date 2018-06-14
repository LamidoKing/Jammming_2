import React from 'react';
import './Profile.css';

let buttonText;
let disconnect;
let buttonClass;
let imageClass;
class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		if (this.props.connected) {
			this.props.onDisconnect();
		} else {
			this.props.onConnect();
		}
	}

	render() {
		if (this.props.connected) {
			buttonText = this.props.connected;
			disconnect = <a className="Connect-button">Disconnect from Spotify</a>;
			buttonClass = 'Disconnect-button disconnect';
			imageClass = 'Profile-image Visible';
		} else {
			buttonText = 'VIEW PROFiLE';
			buttonClass = 'Connect-button';
		}
		return (
			<div className="Connect">
				<a className={buttonClass} onClick={this.handleClick}>
					<img className={imageClass} src={this.props.imageUrl} alt="" />
					{buttonText}
					{disconnect}
				</a>
			</div>
		);
	}
}

export default Profile;
