import React, {Component} from "react";

import AuthService from "../services/auth.service";
import MessageService from "../services/message.service";
import AccommodationService from "../services/accommodation.service";
import {Link} from "react-router-dom";
import UserService from "../services/user.service";

export class ChatListView extends Component {

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
            inContactWith: [],
            accommodationList: [],
            isPremiumUser: false
        };
    }

    componentDidMount() {
        /**
         * Get all the messages between the current user and all other users in order to make a list of users with whom the current user is in contact with
         **/
        MessageService.getOtherUsers(this.state.currentUser._id).then(
            response => {
                let data = response.data;
                let wantsToBeContacted = data.filter(message => message.toId === this.state.currentUser._id);
                let haveBeenContacted = data.filter(message => message.fromId === this.state.currentUser._id);
                haveBeenContacted = haveBeenContacted.filter((v,i,a)=>a.findIndex(t=>(t.toId === v.toId))===i);
                wantsToBeContacted = wantsToBeContacted.filter((v,i,a)=>a.findIndex(t=>(t.fromId === v.fromId))===i);
                haveBeenContacted.map((user) => {
                    wantsToBeContacted = wantsToBeContacted.filter(message => message.fromId != user.toId);
                });
                data = wantsToBeContacted.concat(haveBeenContacted);
                this.setState({
                    inContactWith: data
                });
                data.map((element) => {
                    let id = element.fromId === this.state.currentUser._id ? element.toId : element.fromId;
                    AccommodationService.getAccommodationByUserId(id)
                        .then((accommodation) => {
                            if (!accommodation.data.length) {
                                this.setState({
                                    accommodationList: this.state.accommodationList.concat("no accommodation")
                                });
                            } else {
                                this.setState({
                                    accommodationList: this.state.accommodationList.concat(accommodation.data)
                                });
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
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
        return (
            <React.Fragment>
                <div className="container-fluid text-center mb-5">
                    <h2> Here are the people you are in contact with: </h2>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="form-group text-center">
                                <Link to={`/listing/`}>
                                    <button className="btn btn-primary btn-block">
                                        Back to listing
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="swapt-container">
                                <div style={{height: "600px"}}>
                                    {this.state.inContactWith.map((user, i) => {
                                        return (<div key={i} className="form-group text-center">
                                            <Link to={this.state.accommodationList[i] && this.state.accommodationList[i] !== "no accommodation" ? `/chat/` + this.state.accommodationList[i]._id : `/chat/` + (user.fromId === this.state.currentUser._id ? user.toId : user.fromId)}>
                                                <button className="btn btn-primary btn-block">
                                                    <img style={{width: "10%"}} className="rounded-circle img-fluid" src={this.state.accommodationList[i] && this.state.accommodationList[i] !== "no accommodation" ? this.state.accommodationList[i].user.profile_picture : ""} alt="" />
                                                    &nbsp;{user.fromId === this.state.currentUser._id ? user.toName : user.fromName}
                                                </button>
                                            </Link>
                                        </div>);
                                    })}
                                </div>
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