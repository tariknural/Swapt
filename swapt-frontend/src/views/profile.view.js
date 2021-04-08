import React, {Component} from "react";
import AuthService from "../services/auth.service";

/**
 * Import Components
 */
import { ProfileEditAccountComponent } from "../components/profile/profile-editaccount.component";
import { ProfileEditAccommodationComponent } from "../components/profile/profile-editaccommodation.component";
import { ProfileEditPreferencesComponent } from "../components/profile/profile-editpreferences.component";
import { ProfileEditMembershipComponent } from "../components/profile/profile-editmembership.component";
import {Link} from "react-router-dom";

export class ProfileView extends Component {
    constructor(props) {
        super(props);

        this.editAccountClick = this.editAccountClick.bind(this);
        this.editAccommodationClick = this.editAccommodationClick.bind(this);
        this.editPreferencesClick = this.editPreferencesClick.bind(this);
        this.editMembershipClick = this.editMembershipClick.bind(this);

        const userSession = AuthService.getUserSession();

        if (userSession) {
            this.state = {
                activeUser: userSession.activeUser,
                displayComponent: 'edit_account',
            };
        } else {
            this.props.history.push("/");
            window.location.reload();
        }
    }

    editAccountClick() {
        this.setState({displayComponent: 'edit_account'});
    }

    editAccommodationClick() {
        this.setState({displayComponent: 'edit_accommodation'});
    }

    editPreferencesClick() {
        this.setState({displayComponent: 'edit_preferences'});
    }

    editMembershipClick() {
        this.setState({displayComponent: 'edit_membership'});
    }

    render() {
        const {activeUser} = this.state;
        let renderedComponent = '';
        if(this.state.displayComponent === 'edit_account') {
            renderedComponent = <ProfileEditAccountComponent activeUser={this.state.activeUser} />
        }
        if(this.state.displayComponent === 'edit_accommodation') {
            renderedComponent = <ProfileEditAccommodationComponent activeUser={this.state.activeUser} />
        }
        if(this.state.displayComponent === 'edit_preferences') {
            renderedComponent = <ProfileEditPreferencesComponent />
        }
        if(this.state.displayComponent === 'edit_membership') {
            renderedComponent = <ProfileEditMembershipComponent />
        }

        return (
            <React.Fragment>
                <div className="container">
                    <div className="swapt-container text-center">
                        <h1 className="mb-5">
                            <strong>{activeUser.first_name} {activeUser.last_name}</strong>
                        </h1>
                        <div className="row">
                            <div className="col-lg-3">
                                <div className="swapt-container-white">
                                    <h5>Settings</h5>
                                    <ul className="list-group">
                                        <li style= {{cursor:"pointer"}} className={this.state.displayComponent === "edit_account" ? "list-group-item active" : "list-group-item"} onClick={this.editAccountClick}>Account</li>
                                        <li style= {{cursor:"pointer"}} className={this.state.displayComponent === "edit_accommodation" ? "list-group-item active" : "list-group-item"}  onClick={this.editAccommodationClick}>Accommodation</li>
                                        <li style= {{cursor:"pointer"}} className={this.state.displayComponent === "edit_preferences" ? "list-group-item active" : "list-group-item"}  onClick={this.editPreferencesClick}>Preferences</li>
                                        <li style= {{cursor:"pointer"}} className={this.state.displayComponent === "edit_membership" ? "list-group-item active" : "list-group-item"}  onClick={this.editMembershipClick}>Premium Membership</li>
                                    </ul>
                                </div>

                                <div className="form-group">
                                    <Link to={`/listing/`}>
                                        <button className="btn btn-primary btn-block">
                                            Back to listing
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-lg-9">
                                {renderedComponent}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
