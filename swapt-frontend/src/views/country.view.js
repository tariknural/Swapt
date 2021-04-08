import React, {Component} from "react";
import {Link} from "react-router-dom";
import countryService from "../services/country.service";
import UserService from "../services/user.service";

import CountryComments from "../components/countryComments.component"
import housingIcon from "../assets/icons/housing.png";
import legalIcon from "../assets/icons/legal.png";
import cultureIcon from "../assets/icons/culture.png";

const CountryInformationState = {
    GENERAL_INFORMATION: "generalInformation",
    HOUSING_INFORMATION: "housingInformation",
    LEGAL_INFORMATION: "legalInformation",
    CULTURAL_INFORMATION: "culturalInformation"
}

const CountryInformationText = {
    generalInformation: "General Information",
    housingInformation: "Housing Information",
    legalInformation: "Legal Information",
    culturalInformation: "Cultural Information"
}

export class CountryView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            countryId: props.match.params.id,
            country: {
                name: null
            },
            currentInformation: CountryInformationState.GENERAL_INFORMATION
        }
    }

    componentDidMount() {
        countryService.getCountryById(this.state.countryId).then(response => {
            this.setState({
                country: response.data
            })
        },
        error => {
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            this.setState({
                loading: false,
                message: resMessage
            });
        })

        // check user premium member status
        UserService.getUserPremiumStatus().then(
            response => {
                this.setState({
                    isPremiumUser: response.data.premium
                });
            }
        );
    }

    selectInformation(countryInformationState){
        this.setState({
            currentInformation: countryInformationState,
        });
    }

    render() {

        let paragraphs = [];
        if (this.state.currentInformation && this.state.country.name) {
            let text = this.state.country[this.state.currentInformation];
            paragraphs = text.split("\n\n");
        }

        return (
            <div>
                <header className="page-header mb-5" style={{
                    backgroundImage:"url(" + this.state.country.banner_picture + ")",
                    backgroundSize: "cover"
                }}>
                    <div className="page-header-subtext">
                        <span>Country Information</span>
                    </div>
                    <div className="page-header-text">
                        <span>{this.state.country.name}</span>
                    </div>
                </header>

                <div className="row">
                    <div className="col-3 d-flex justify-content-center">
                        <view style={{width:200, alignSelf: 'center', textAlign: 'center'}}>
                            <input type="image" src={this.state.country.flag_picture} className="btn-information" onClick={() => this.selectInformation(CountryInformationState.GENERAL_INFORMATION)}></input>
                            <h4><span>General Information</span></h4>
                        </view>
                    </div>
                    <div className="col-3 d-flex justify-content-center">
                        <view style={{width:200, alignSelf: 'center', textAlign: 'center'}}>
                            <input type="image" src={housingIcon} className="btn-information" onClick={() => this.selectInformation(CountryInformationState.HOUSING_INFORMATION)}></input>
                            <h4><span>Housing Information</span></h4>
                        </view>
                    </div>
                    <div className="col-3 d-flex justify-content-center">
                        <view style={{width:200, alignSelf: 'center', textAlign: 'center'}}>
                            <input type="image" src={legalIcon} className="btn-information" onClick={() => this.selectInformation(CountryInformationState.LEGAL_INFORMATION)}></input>
                            <h4><span>Legal Information</span></h4>
                        </view>
                    </div>
                    <div className="col-3 d-flex justify-content-center">
                        <view style={{width:200, alignSelf: 'center', textAlign: 'center'}}>
                            <input type="image" src={cultureIcon} className="btn-information" onClick={() => this.selectInformation(CountryInformationState.CULTURAL_INFORMATION)}></input>
                            <h4><span>Cultural Information</span></h4>
                        </view>
                    </div>
                </div>

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="form-group">
                                <Link to={`/listing/`}>
                                    <button className="btn btn-primary btn-block">
                                        Back to listing
                                    </button>
                                </Link>
                            </div>
                            <div className="form-group">
                                <Link to={`/country/`}>
                                    <button className="btn btn-secondary btn-block">Select Country</button>
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="swapt-container">
                                <h1 className="text-center">{CountryInformationText[this.state.currentInformation]}</h1>
                                    {paragraphs.map(value => {
                                        return <p key={value.toString()} >{value}</p>;
                                    })}
                                {this.state.message && (
                                    <div className="form-group">
                                        <div className="alert alert-danger" role="alert">
                                            {this.state.message}
                                        </div>
                                    </div>
                                )}
                            </div>
                            { <CountryComments countryId={this.state.countryId} currentInformation={this.state.currentInformation}></CountryComments> }
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
            </div>
        )
    }
}
