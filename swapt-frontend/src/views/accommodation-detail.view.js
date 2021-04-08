import React, {Component} from "react";
import {Link} from "react-router-dom";
import AuthService from "../services/auth.service";
import GoogleMapReact from "google-map-react";
import AccommodationDetailService from "../services/accommodatin-detail-service";
import Loader from "react-loader-spinner";
import ImageGallery from 'react-image-gallery';
import UserService from "../services/user.service";
import verifiedImage from "../assets/images/verified-user.png";

export class AccommodationDetailView extends Component {
    constructor(props) {
        super(props);

        // initialize state for AccommodationDetailView
        this.state = {
            currentUser: this.checkAuth(),
            isPremiumUser: false,
            accommodationDetails: "",
            accommodationPictures: [],
            loading: true,
            fromDate: "",
            toDate: "",
        };

    }

    componentDidMount() {
        let accommodationId = this.props.match.params.id;

        // get accommodation detail
        AccommodationDetailService.getAccommodationDetailById(accommodationId)
            .then((accommodationDetails) => {

                // if accommodation is not active redirect user to listing
                if(accommodationDetails.data.is_active === false) {
                    this.props.history.push("/listing");
                    window.location.reload();
                }

                // set picture array
                let accommodationPictures = [];
                accommodationDetails.data.pictures.forEach(picture_url => {
                    let singlePicture = {original:picture_url,thumbnail:picture_url};
                    accommodationPictures.push(singlePicture);
                })

                this.setState({
                    accommodationDetails: accommodationDetails.data,
                    fromDate: new Date(
                        accommodationDetails.data.user.exchange_date_start
                    ).toLocaleDateString(),
                    toDate: new Date(
                        accommodationDetails.data.user.exchange_date_end
                    ).toLocaleDateString(),
                    accommodationPictures: accommodationPictures
                });
                let me = this;
                setTimeout(() => {
                    me.setState({
                        loading: false
                    })
                }, 1000);
            })
            .catch((error) => {
                console.log(error);
            });

        // check user premium member status
        UserService.getUserPremiumStatus().then(
            response => {
                this.setState({
                    isPremiumUser: response.data.premium
                });
            }
        );
    }

    checkAuth() {
        /**
         * Check if User Logged In
         */
        const userSession = AuthService.getUserSession();
        let currentUser = undefined;
        if (userSession) {
            currentUser = userSession.activeUser;
        }
        // if no user then redirect to start page
        else {
            this.props.history.push("/");
            window.location.reload();
        }
        return currentUser;
    }

    render() {
        const Marker = ({text}) => <div>{text}</div>;

        return (
            <React.Fragment>
                {this.state.loading && (
                    <div style={{textAlign: "center"}}>
                        <br></br>
                        <br></br>

                        <Loader
                            type="Puff"
                            color="#00BFFF"
                            height={350}
                            width={350}
                            visible={this.state.loading}
                        />
                    </div>
                )}
                {!this.state.loading && (
                    <React.Fragment>

                        <header className="page-header mb-5" style={{
                            backgroundImage:"url(" + this.state.accommodationDetails.pictures[0] + ")",
                            backgroundSize: "cover"
                        }}>
                            <div className="page-header-subtext">
                                <span>{this.state.accommodationDetails.city.name}</span>
                            </div>
                            <div className="page-header-text">
                                <span>{this.state.accommodationDetails.user.first_name}'s Accommodation</span>
                            </div>
                        </header>

                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-sm-3">
                                    <Link to={`/listing/`}>
                                        <button className="btn btn-primary btn-block">
                                            Back to listing
                                        </button>
                                    </Link>
                                </div>
                                <div className="col-sm-6">
                                    <div className="swapt-container accommodation">
                                        <div className="row mb-4">
                                            <div className="col-sm-2">
                                                <img
                                                    src={this.state.accommodationDetails.user.profile_picture}
                                                    alt="profile-img"
                                                    className="profile-img"
                                                />
                                            </div>
                                            <div className="col-sm-7">
                                                <h4>
                                                    {this.state.accommodationDetails.user.first_name}{" "}
                                                    {this.state.accommodationDetails.user.last_name}
                                                    {this.state.accommodationDetails.user.is_verified_exchange_student &&
                                                    <img className="verified-user-logo" src={verifiedImage}/>}
                                                </h4>
                                                <h6 className="text-muted mb-3">
                                                    Exchange Student from{" "}
                                                    {this.state.accommodationDetails.user.home_university.name}{" "}
                                                    to{" "}
                                                    {
                                                        this.state.accommodationDetails.user
                                                            .destination_university.name
                                                    }
                                                    <br/>
                                                </h6>
                                                <p className="text-success">
                                                    {this.state.accommodationDetails.user
                                                        .is_verified_exchange_student &&
                                                    "Verified Exchange Student"}
                                                    {this.state.accommodationDetails.is_verified_by_landlord &&
                                                    this.state.accommodationDetails.user
                                                    .is_verified_exchange_student &&
                                                    " & " }
                                                    {this.state.accommodationDetails.is_verified_by_landlord &&
                                                    "Landlord Approved" }
                                                    <br/>
                                                </p>
                                            </div>
                                            <div className="col-sm-3" style={{textAlign: "center"}}>
                                                <h4>{this.state.accommodationDetails.size} m2</h4>
                                                <p>Apartment Size</p>
                                                <h4>{this.state.accommodationDetails.rent_per_month} €</h4>
                                                <p>Monthly Rental</p>
                                                <Link to={`/chat/` + this.state.accommodationDetails._id}>
                                                    <button className="btn btn-primary btn-block">
                                                        Chat now
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <ImageGallery items={this.state.accommodationPictures} />
                                        </div>
                                        <div className="row swapt-container-white mt-4">
                                            <p className="text-muted">
                                                {this.state.accommodationDetails.accommodation_description_title}
                                                <br/>
                                                {this.state.accommodationDetails.accommodation_description}
                                            </p>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <h4>
                                                    Accommodation Details
                                                </h4>
                                            </div>

                                            <div className="col-sm-6">
                                                <div className="swapt-container-white">
                                                    <h6>Address</h6>
                                                    {this.state.isPremiumUser ? (
                                                        <React.Fragment>
                                                            <div className="text-muted">{this.state.accommodationDetails.street} {this.state.accommodationDetails.street_number}</div>
                                                            <div className="text-muted">{this.state.accommodationDetails.zip_code}</div>
                                                            <div className="text-muted mb-3">{this.state.accommodationDetails.city.name} {this.state.accommodationDetails.country.name}</div>
                                                        </React.Fragment>
                                                    ) : (
                                                        <React.Fragment>
                                                            <div className="text-muted">{this.state.accommodationDetails.zip_code}</div>
                                                            <div className="text-muted mb-3">{this.state.accommodationDetails.city.name} {this.state.accommodationDetails.country.name}</div>
                                                        </React.Fragment>
                                                    )}

                                                    <h6>Availability</h6>
                                                    <div className="text-muted">
                                                        <div>From: {this.state.fromDate}</div>
                                                        <div>To: {this.state.toDate}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="swapt-container-white">
                                                    <h6>Details</h6>
                                                    <div className="text-muted">No Smoker</div>
                                                    <div className="text-muted">Shared Bathroom</div>
                                                    <div className="text-muted">Pet Allowed</div>
                                                </div>
                                            </div>
                                        </div>
                                        {/*<div className="row">
                                            <div className="col-xl-12 offset-xl-0">
                                                <GoogleMapReact
                                                    bootstrapURLKeys={{key: "AIzaSyD3dBYWHTmLUm4k4zAdoye__yCGJrxHNtg"}}
                                                    defaultCenter={
                                                        this.state.accommodationDetails.google_map.center
                                                    }
                                                    defaultZoom={
                                                        this.state.accommodationDetails.google_map.zoom
                                                    }
                                                >
                                                    <Marker
                                                        lat={this.state.accommodationDetails.google_map.lat}
                                                        lng={this.state.accommodationDetails.google_map.lng}
                                                        text="Exact location"
                                                    />
                                                </GoogleMapReact>
                                            </div>
                                        </div>*/}
                                    </div>
                                </div>
                                <div className="col-sm-3">
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
                )}
            </React.Fragment>
        );
    }
}
