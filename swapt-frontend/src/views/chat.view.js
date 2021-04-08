import React, {Component} from "react";

import InputMessage from '../components/input_message.component';
import Messages from './messages.view';
import { registerOnMessageCallback, send } from '../websocket';

import AuthService from "../services/auth.service";
import MessageService from "../services/message.service";
import UserService from "../services/user.service";
import AccommodationDetailService from "../services/accommodatin-detail-service";
import {Link} from "react-router-dom";

export class ChatView extends Component {

    constructor (props) {
        super(props);

        /**
         * Verify that a user is logged in
         */
        const userSession = AuthService.getUserSession();
        let currentUser = undefined;
        if (userSession) {
            currentUser = userSession.activeUser;
        } else {
            this.props.history.push("/");
            window.location.reload();
        }

        /**
         * State variables
         */
        this.state = {
            currentUser: currentUser,
            fromName: currentUser.first_name.concat(" ", currentUser.last_name),
            otherUser: "",
            toName: "",
            profilePicture: "",
            accommodationDetails: "",
            userIds: currentUser._id,
            messages: [],
            isPremiumUser: false
        };

        /**
         * Set onMessageReceived function as callback for when a message is received
         */
        registerOnMessageCallback(this.onMessageReceived.bind(this));
    }

    /**
     * Get accommodation id from link
     */
    retrieveIdFromURI() {
        let URI = window.location.pathname;
        let parts = URI.split("/");
        let answer = parts[parts.length - 1];
        return answer;
    }

    /**
     * Get accommodation owner to retrieve messages between current user and owner of accommodation
     */
    getAccommodationDetails(id) {
        AccommodationDetailService.getAccommodationDetailById(id)
            .then((accommodationDetails) => {
                /**
                 * In case other user has no accommodation, get other user's id
                 */
                if (!accommodationDetails.data) {
                    UserService.getUserById(id)
                        .then((user) => {
                            this.setState({
                                accommodationDetails: "no accommodation",
                                otherUser: id,
                                toName: user.data.first_name.concat(" ", user.data.last_name),
                                profilePicture: user.data.profile_picture
                            });
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                } else {
                    this.setState({
                        accommodationDetails: accommodationDetails.data,
                        otherUser: accommodationDetails.data.user._id,
                        toName: accommodationDetails.data.user.first_name.concat(" ", accommodationDetails.data.user.last_name),
                        profilePicture: accommodationDetails.data.user.profile_picture,
                        userIds: this.state.userIds.concat("-", accommodationDetails.data.user._id)
                    });
                }

                /**
                 * Retrieve all messages between two users
                 */
                let otherUser = accommodationDetails.data ? accommodationDetails.data.user._id : id;
                MessageService.getMessages(this.state.currentUser._id, otherUser).then(
                    response => {
                        this.setState({
                            messages: response.data
                        });
                    },
                    error => {
                        this.setState({
                            error_message_get:
                                (error.response &&
                                    error.response.data &&
                                    error.response.data.message) ||
                                error.message ||
                                error.toString()
                        });
                    }
                );
            })
            .catch((error) => {
                console.log(error);
            });
    }

    /**
     * When user receives a message
     */
    onMessageReceived (message) {
        // Parse the message
        message = JSON.parse(message);
        // Add the message to the list of messages
        if ((message.fromName === this.state.fromName || message.fromName === this.state.toName) && (message.toName === this.state.fromName || message.toName === this.state.toName)) {
            this.setState({
                messages: this.state.messages.concat(message)
            });
        }
    }

    /**
     * When user sends a message
     */
    sendMessage (msg) {
        // Create Message object
        const message = {
            fromName: this.state.fromName,
            toName: this.state.toName,
            message: msg
        };
        // Add the Message to the database
        MessageService.sendMessage(
            this.state.currentUser._id,
            message.fromName,
            this.state.otherUser,
            this.state.toName,
            message.message
        ).then (
            response => {

            },
            error => {
                this.setState({
                    error_message_send:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString()
                });
            }
        );
        // Construct a string of the Message object and sends it to the instant-messaging server
        // send is imported from the websocket package
        send(JSON.stringify(message));
    }

    componentDidMount() {
        this.getAccommodationDetails(this.retrieveIdFromURI());

        // Check if user has a premium member status
        UserService.getUserPremiumStatus().then(
            response => {
                this.setState({
                    isPremiumUser: response.data.premium
                });
            }
        );
    }

    render () {
        const sendMessage = this.sendMessage.bind(this);

        return (
            <React.Fragment>
                <div className="container-fluid text-center mb-5">
                    {this.state.profilePicture && (
                        <h2>
                            <img style={{width: "5%"}} className="rounded-circle img-fluid" src={this.state.profilePicture} alt="" />
                            &nbsp;{this.state.toName}
                        </h2>
                    )}
                    {!this.state.profilePicture && (
                        <h2>
                            {this.state.toName}
                        </h2>
                    )}
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-3">
                            {this.state.accommodationDetails !== "no accommodation" && (
                                <div className="form-group text-center">
                                    <Link to={`/accommodation/` + this.state.accommodationDetails._id}>
                                        <button className="btn btn-primary btn-block" style={{ padding: "7px", marginTop: "20px" }}>
                                            {this.state.toName}'s Accommodation
                                        </button>
                                    </Link>
                                </div>
                            )}
                            <div className="form-group text-center">
                                <Link to={`/chatList/`}>
                                    <button className="btn btn-primary btn-block">
                                        Back to Chat listing
                                    </button>
                                </Link>
                            </div>
                            <div className="form-group text-center">
                            <Link to={`/listing/`}>
                                <button className="btn btn-primary btn-block">
                                    Back to Accommodation listing
                                </button>
                            </Link>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="swapt-container">
                                <Messages messages={this.state.messages} username={this.state.fromName} />
                                <InputMessage onSend={sendMessage} />
                            </div>
                        </div>
                        <div className="col-lg-3">
                            {!this.state.isPremiumUser && (
                                <div className="swapt-container">
                                    <h5 className="text-center">Advertisement</h5>
                                    <div className="text-center">
                                        <img width="250" height="250"
                                             src="https://res.cloudinary.com/dikb9ev9w/image/upload/f_auto,q_auto/v1574252820/Flashban/250x250cyber"
                                             data-src="https://res.cloudinary.com/dikb9ev9w/image/upload/f_auto,q_auto/v1574252820/Flashban/250x250cyber"
                                             className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail lazyloaded"
                                             alt="Cyber Gif Ad Banner" />
                                        <img width="250" height="250"
                                             src="https://res.cloudinary.com/dikb9ev9w/image/upload/f_auto,q_auto/v1573455612/Flashban/250x250cloud"
                                             data-src="https://res.cloudinary.com/dikb9ev9w/image/upload/f_auto,q_auto/v1573455612/Flashban/250x250cloud"
                                             className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail lazyloaded"
                                             alt="Cloud Hosting Gif Ad banner"/>
                                        <img width="250" height="250"
                                             src="https://res.cloudinary.com/dikb9ev9w/image/upload/f_auto,q_auto/v1573728617/Flashban/250x250watch"
                                             data-src="https://res.cloudinary.com/dikb9ev9w/image/upload/f_auto,q_auto/v1573728617/Flashban/250x250watch"
                                             className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail lazyloaded"
                                             alt="" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}