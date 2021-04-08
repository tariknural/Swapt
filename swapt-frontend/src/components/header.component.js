import React, { Component } from "react";
import {Link} from "react-router-dom";
import AuthService from "../services/auth.service";

//images
import SwaptLogo from "../assets/images/logo/swapt-logo-blue.png";

export class HeaderComponent extends Component {
    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);

        // get activeUser passed as props from App.js
        // init profile_picture
        let profile_picture = '//ssl.gstatic.com/accounts/ui/avatar_2x.png'
        if(this.props.activeUser.profile_picture !== undefined) {
            profile_picture = this.props.activeUser.profile_picture
        }

        this.state = {
            activeUser: this.props.activeUser,
            profile_picture: profile_picture
        };
    }

    logOut() {
        AuthService.logout();
    }

    render() {
        const {activeUser} = this.state;

        return (
            <nav className="navbar navbar-expand-sm">
                {activeUser ? (
                    <Link to={"/listing"} className="navbar-brand">
                        <img src={SwaptLogo} alt="Logo" height={45} />
                    </Link>
                ) : (
                    <Link to={"/"} className="navbar-brand">
                        <img src={SwaptLogo} alt="Logo" height={45} />
                    </Link>
                )}

                {activeUser ? (
                    <div className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link to={"/profile"} className="nav-link">
                                <img src={this.state.profile_picture}
                                    alt="profile-img"
                                     className="nav-profile-picture"
                                />
                                {activeUser.first_name} {activeUser.last_name}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <a href="/listing" className="nav-link" style={{paddingTop: '14px'}}>
                                Listing
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="/country" className="nav-link" style={{paddingTop: '14px'}}>
                                Countries
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="/chatList" className="nav-link" style={{paddingTop: '14px'}}>
                                Chat
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="/" className="nav-link" onClick={this.logOut} style={{paddingTop: '14px'}}>
                                Logout
                            </a>
                        </li>
                    </div>
                ) : (
                    <div className="navbar-nav ml-auto">

                        <li className="nav-item">
                            <Link to={"/register"} className="nav-link">
                                Register
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link to={"/login"} className="nav-link">
                                Login
                            </Link>
                        </li>
                    </div>
                )}
            </nav>
        );
    }
}
