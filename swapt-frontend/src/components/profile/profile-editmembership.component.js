import React, { Component } from "react";
import CheckButton from "react-validation/build/button";
import Form from "react-validation/build/form";
import AuthService from "../../services/auth.service";
import UserService from "../../services/user.service";

export class ProfileEditMembershipComponent extends Component {
    constructor(props) {
        super(props);

        this.becomePremium = this.becomePremium.bind(this);
        this.becomeFreeUser = this.becomeFreeUser.bind(this);

        const userSession = AuthService.getUserSession();

        if (userSession) {
            this.state = {
                activeUser: userSession.activeUser,
                isPremiumUser: false,
                successful: false,
                message: "",
                error_message: "",
            };
        } else {
            this.props.history.push("/");
            window.location.reload();
        }
    }

    componentDidMount() {
        // check user premium member status
        UserService.getUserPremiumStatus().then(
            response => {
                this.setState({
                    isPremiumUser: response.data.premium
                });
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                this.setState({
                    successful: false,
                    message: resMessage
                });
            }
        );
    }

    becomePremium(e) {
        e.preventDefault();
        UserService.setUserRole('premiumUser').then(
            () => {
                this.setState({
                    isPremiumUser: true,
                    successful: true,
                    message: "You are now premium user"
                });
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                this.setState({
                    successful: false,
                    message: resMessage
                });
            }
        );
    }

    becomeFreeUser(e) {
        e.preventDefault();
        UserService.setUserRole('user').then(
            () => {
                this.setState({
                    isPremiumUser: false,
                    successful: true,
                    message: "Membership canceled"
                });
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                this.setState({
                    successful: false,
                    message: resMessage
                });
            }
        );
    }

    render() {
        return (
            <div className="swapt-container-white">
                <h3 className="mb-5">Premium Membership</h3>

                {this.state.message && (
                    <div
                        className={
                            this.state.successful
                                ? "alert alert-success"
                                : "alert alert-danger"
                        }
                        role="alert"
                    >
                        {this.state.message}
                    </div>
                )}

                {this.state.isPremiumUser ? (
                    <React.Fragment>
                        <div className="mb-3">Membership Status: <span className="text-success">Premium User</span></div>
                        <button className="btn btn-danger" onClick={this.becomeFreeUser}>
                            <span>Cancel Membership</span>
                        </button>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <div className="mb-3">Membership Status: <span className="text-primary">Free User</span></div>
                        <button className="btn btn-success" onClick={this.becomePremium}>
                            <span>Become Premium Member</span>
                        </button>
                    </React.Fragment>
                )}
            </div>
        );
    }
}
