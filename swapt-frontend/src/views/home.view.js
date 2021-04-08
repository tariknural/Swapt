import React, {Component} from "react";
import TravelImage from "../assets/images/travel.png";
import Preferences from "../assets/images/preferences.png";
import Accommodation from "../assets/images/accommodation.png";
import Listing from "../assets/images/listing.png";
import Chat from "../assets/images/chat.png";
import Swap from "../assets/images/swap.png";
import partnerImage1 from "../assets/images/partner-logo/tum.png";
import partnerImage2 from "../assets/images/partner-logo/stockholm-uni.png";
import {Link} from "react-router-dom";
import AuthService from "../services/auth.service";

const textArray1 = ['Connects', 'Keeps', 'Saves'];
const textArray2 = ['Exchange Students', 'Your Accommodation', 'You Money'];

export class HomeView extends Component {
    constructor(props) {
        super(props);
        this.state = { textIdx: 0 };

        const userSession = AuthService.getUserSession();
        // if user logged in then redirect to listing
        if (userSession) {
            this.props.history.push("/listing");
            window.location.reload();
        }
    }

    componentDidMount() {
        this.timeout = setInterval(() => {
            let currentIdx = this.state.textIdx;
            this.setState({ textIdx: currentIdx + 1 });
        }, 5000);
    }

    componentDidUnmount() {
        clearInterval(this.timeout);
    }

    render() {
        let textThatChanges = textArray1[this.state.textIdx % textArray1.length];
        let textThatChanges2 = textArray2[this.state.textIdx % textArray2.length];
        return (
            <React.Fragment>
                <div className="container-fluid container-start">
                    <div className="row">
                        <div className="col-sm-10 col-centered">
                            <div className="row">
                                <div className="col-5">
                                    <div className="start-big-text">
                                        <div style={{color:"#009EE0"}}>Swapt</div>
                                        <div>{textThatChanges}</div>
                                        <div style={{color:"#009EE0"}}>{textThatChanges2}</div>
                                    </div>
                                    <div className="mb-3 mt-3">
                                        Swapt successfully connects more than 10.000 exchange students since 2020 in order for them to switch accommodations during their time abroad
                                    </div>
                                    <Link to={`/register`}>
                                        <button className="btn btn-primary">
                                            Register Now
                                        </button>
                                    </Link>
                                </div>
                                <div className="col-sm-6 offset-1">
                                    <img src={TravelImage} alt="Logo" style={{width:"100%"}} />
                                </div>
                            </div>
                            <div className="row mt-5">
                                <div className="col-sm-12">
                                    <div className="start-sub-text">How does <span style={{color:"#009EE0"}}>Swapt</span> works?</div>
                                </div>
                            </div>
                            <div className="row" style={{textAlign:"center"}}>
                                <div className="card" style={{width: "15rem"}}>
                                    <img style={{width: "100%", display: "block", marginLeft: "auto", marginRight: "auto"}} className="card-img-top" src={Preferences} alt="Card image cap"/>
                                    <div className="card-body">
                                        <h5 className="card-title">Setup your preferences</h5>
                                        <p className="card-text">Select your home and destination cities as well as the beginning and end of your exchange's duration.</p>
                                    </div>
                                </div>
                                <div className="card" style={{width: "15rem"}}>
                                    <img style={{width: "95%", display: "block", marginLeft: "auto", marginRight: "auto"}} className="card-img-top" src={Accommodation} alt="Card image cap"/>
                                    <div className="card-body">
                                        <h5 className="card-title">Enter your accommodation into the listing</h5>
                                        <p className="card-text">If you don't want to lose the accommodation you have in your current city, you may sublet it to another exchange student while you are abroad.</p>
                                    </div>
                                </div>
                                <div className="card" style={{width: "15rem"}}>
                                    <img style={{width: "105%", display: "block", marginLeft: "auto", marginRight: "auto"}} className="card-img-top" src={Listing} alt="Card image cap"/>
                                    <div className="card-body">
                                        <h5 className="card-title">Browse accommodation listing</h5>
                                        <p className="card-text">Based on your preferences we will provide a listing of available accommodations in your destination city, leased or owned by other exchange students who are willing to sublet their accommodation.</p>
                                    </div>
                                </div>
                                <div className="card" style={{width: "15rem"}}>
                                    <img style={{width: "100%", display: "block", marginLeft: "auto", marginRight: "auto"}} className="card-img-top" src={Chat} alt="Card image cap"/>
                                    <div className="card-body">
                                        <h5 className="card-title">Contact fellow exchange students</h5>
                                        <p className="card-text">You can get it touch with other exchange students from your destination city. You may even find the one planning on studying in your current city.</p>
                                    </div>
                                </div>
                                <div className="card" style={{width: "15rem"}}>
                                    <img style={{width: "100%", display: "block", marginLeft: "auto", marginRight: "auto"}} className="card-img-top" src={Swap} alt="Card image cap"/>
                                    <div className="card-body">
                                        <h5 className="card-title">Exchange accommodation</h5>
                                        <p className="card-text">You exchange your accommodation with an exchange student from your destination city.<br/>
                                        Benefit: <br/><span className="text-success">Saving money and keeping your accommodation during your studies abroad</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-5">
                                <div className="col-sm-12">
                                    <div className="start-sub-text">Partner University</div>
                                </div>
                                <div className="col-sm-12 mt-4" style={{textAlign:"center"}}>
                                    <img src={partnerImage1} alt="Logo" style={{height:"50px", paddingRight:"20px"}} />
                                    {/*<img src={partnerImage2} alt="Logo" style={{height:"50px", paddingRight:"20px"}} />*/}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
