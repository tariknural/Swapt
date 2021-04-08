import React, {Component} from "react";
import AuthService from "../services/auth.service";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AccommodationFilterService from "../services/accommodation-filter";
import AccommodationListingComponent from "../components/accommodation-listing.component";
import AccommodationListingCountryComponent from "../components/accommodation-listing-country.component";
import Loader from "react-loader-spinner";
import ReactPaginate from "react-paginate";
import UserService from "../services/user.service";
import {Link} from "react-router-dom";
import verifiedImage from "../assets/images/verified-user.png";

export class ListingView extends Component {
    constructor(props) {
        super(props);

        this.handleFilter = this.handleFilter.bind(this);
        this.onChangeSize = this.onChangeSize.bind(this);
        this.onChangeRentPerMonth = this.onChangeRentPerMonth.bind(this);
        this.onChangeStreetName = this.onChangeStreetName.bind(this);
        this.onChangeStreetNumber = this.onChangeStreetNumber.bind(this);
        this.onChangeZipCode = this.onChangeZipCode.bind(this);
        this.onChangeVerifiedUser = this.onChangeVerifiedUser.bind(this);
        this.onChangeVerifiedAccommodation = this.onChangeVerifiedAccommodation.bind(this);
        this.onChangeGoingToMyCity = this.onChangeGoingToMyCity.bind(this);

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

        // redirect to setup process if no exchange infos set
        if (currentUser.destination_city == undefined ||
            currentUser.exchange_date_start == undefined ||
            currentUser.exchange_date_end == undefined) {
            this.props.history.push("/user_setup");
            window.location.reload();
        }

        // init state variables
        this.state = {
            currentUser: currentUser,
            fromDate: new Date(currentUser.exchange_date_start).toLocaleDateString(),
            toDate: new Date(currentUser.exchange_date_end).toLocaleDateString(),
            countryName: "",
            countryId: "",
            cityPictureUrl: "",
            cityName: "",
            cityId: "",
            size: "",
            rent_per_month: "",
            zip_code: "",
            street_name: "",
            street_number: "",
            listingData: "",
            successful: false,
            loading: false,
            offset: 0,
            data: [],
            perPage: 5,
            currentPage: 0,
            listingComponents: "",
            isPremiumUser: false,
            verified_user: "",
            verified_accommodation: "",
            to_my_city: "",
        };

        this.handlePageClick = this.handlePageClick.bind(this);
    }

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState(
            {
                currentPage: selectedPage,
                offset: offset,
            },
            () => {
                this.organizeData();
            }
        );
    };

    organizeData() {

        let data = this.state.listingData;
        let slice = data.slice(
            this.state.offset,
            this.state.offset + this.state.perPage
        );
        let listingComponents = slice.map((item, key) => (

            <div
                key={this.state.offset * this.state.perPage + key}
            >
                <AccommodationListingComponent
                    listingData={item}
                ></AccommodationListingComponent>
            </div>
        ));

        this.setState({
            pageCount: Math.ceil(data.length / this.state.perPage),
            listingComponents: listingComponents,
        });
        // this.showLoader();
        // this.hideLoader();
    }

    componentDidMount() {
        this.getUserDestinationCityAndCountry();

        // check user premium member status
        UserService.getUserPremiumStatus().then(
            response => {
                this.setState({
                    isPremiumUser: response.data.premium
                });
            }
        );
    }

    showLoader() {
        this.setState({
            loading: true,
        });
    }

    hideLoader() {
        let me = this;
        setTimeout(() => {
            me.setState({
                loading: false,
            });
        }, 1000);
    }

    getUserDestinationCityAndCountry() {
        AccommodationFilterService.getUserDestinationCityAndCountry({
            userId: this.state.currentUser._id,
        }).then(
            (resp) => {
                this.setState({
                    cityPictureUrl: resp.data.destination_city.banner_picture,
                    countryName: resp.data.destination_city.country.name,
                    countryId: resp.data.destination_city.country._id,
                    cityName: resp.data.destination_city.name,
                    cityId: resp.data.destination_city._id,
                    country: resp.data.destination_city.country,
                });

                this.handleFilter(document.createEvent("MouseEvents"));
            },
            (error) => {
                this.setState({
                    error_message:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString(),
                });
            }
        );
    }

    handleFilter(e) {
        e.preventDefault();

        this.setState({
            message: "",
            successful: false,
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            this.showLoader();
            AccommodationFilterService.getAccommodationListing({
                country: this.state.countryId,
                city: this.state.cityId,
                size: this.state.size,
                rent_per_month: this.state.rent_per_month,
                zip_code: this.state.zip_code,
                street_name: this.state.street_name,
                street_number: this.state.street_number,
                verified_accommodation: this.state.verified_accommodation,
                verified_user: this.state.verified_user,
                to_my_city: this.state.to_my_city
            }).then(
                (response) => {
                    this.setState({
                        listingData: response.data,
                        message: "Search successful !",
                        successful: true,
                    });
                    this.hideLoader();
                    this.organizeData();
                },
                (error) => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    this.setState({
                        listingData: "",
                        successful: false,
                        message: resMessage,
                    });
                    this.hideLoader();
                }
            );
        }
    }

    onChangeSize(e) {
        if (e.target.value == 0) {
            this.setState({
                size: "",
            });
        } else {
            this.setState({
                size: e.target.value,
            });
        }
    }

    onChangeRentPerMonth(e) {
        if (e.target.value == 0) {
            this.setState({
                rent_per_month: "",
            });
        } else {
            this.setState({
                rent_per_month: e.target.value,
            });
        }
    }

    onChangeZipCode(e) {
        this.setState({
            zip_code: e.target.value,
        });
    }

    onChangeVerifiedUser(e) {
        this.setState({
            verified_user: e.target.checked ? true : "",
        });
    }

    onChangeVerifiedAccommodation(e) {
        this.setState({
            verified_accommodation: e.target.checked ? true : "",
        });
    }

    onChangeGoingToMyCity(e) {
        this.setState({
            to_my_city: e.target.checked ? true : "",
        });
    }

    onChangeStreetName(e) {
        this.setState({
            street_name: e.target.value,
        });
    }

    onChangeStreetNumber(e) {
        this.setState({
            street_number: e.target.value,
        });
    }

    render() {
        return (
            <React.Fragment>
                <header
                    className="page-header mb-5"
                    style={{
                        backgroundImage: "url(" + this.state.cityPictureUrl + ")",
                        backgroundSize: "cover",
                    }}
                >
                    <div className="page-header-subtext">
                        <span>Your next exchange semester to</span>
                    </div>
                    <div className="page-header-text">
                        <span>{this.state.cityName}</span>
                    </div>
                </header>
                <div className="container-fluid text-center mb-5">
                    {this.state.successful && (
                        <h2>
                            {this.state.listingData.length} {this.state.cityName} Students
                            are going on exchange
                        </h2>
                    )}
                    <span>
                From {this.state.fromDate} to {this.state.toDate}
              </span>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="swapt-container">
                                <Form
                                    onSubmit={this.handleFilter}
                                    ref={(c) => {
                                        this.form = c;
                                    }}
                                >
                                    <h5 className="text-center mb-3">Filter</h5>
                                    {/*<label>Country</label>
                                    <Input
                                        value={this.state.countryName}
                                        className="form-control"
                                        type="text"
                                        disabled={true}
                                    />
                                    <label>City</label>
                                    <Input
                                        value={this.state.cityName}
                                        className="form-control"
                                        type="text"
                                        disabled={true}
                                    />*/}

                                    {this.state.size > 0 ? (
                                        <label htmlFor="size">
                                            Maximum Size: {this.state.size} m2
                                        </label>
                                    ) : (
                                        <label htmlFor="size">Maximum Size: show all</label>
                                    )}
                                    <Input
                                        type="range"
                                        min={0}
                                        max={300}
                                        className="custom-range"
                                        name="size"
                                        value={this.state.size}
                                        onChange={this.onChangeSize}
                                    />

                                    {this.state.rent_per_month > 0 ? (
                                        <label htmlFor="rent_per_mont">
                                            Maximum Rent: {this.state.rent_per_month}€/Month{" "}
                                        </label>
                                    ) : (
                                        <label htmlFor="rent_per_mont">
                                            Maximum Rent: show all
                                        </label>
                                    )}

                                    <Input
                                        type="range"
                                        min="0"
                                        max="3000"
                                        className="custom-range"
                                        name="rent_per_month"
                                        value={this.state.rent_per_month}
                                        onChange={this.onChangeRentPerMonth}
                                    />

                                    {/*Premium only filter here*/}
                                    {this.state.isPremiumUser && (
                                        <React.Fragment>
                                            <h5 className="text-success text-center mb-3 mt-3">
                                                Premium Filter
                                            </h5>

                                            <label htmlFor="zip_code">Zip Code</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="zip_code"
                                                value={this.state.zip_code}
                                                onChange={this.onChangeZipCode}
                                                validations={[this.zipCode]}
                                            />

                                            <label htmlFor="street_name">Street Name</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="street_name"
                                                value={this.state.street_name}
                                                onChange={this.onChangeStreetName}
                                                validations={[this.streetName]}
                                            />

                                            <label htmlFor="street_number">Street Number</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="street_number"
                                                value={this.state.street_number}
                                                onChange={this.onChangeStreetNumber}
                                                validations={[this.streetNumber]}
                                            />

                                            <div className="form-row">
                                                <div className="col-sm-12">
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            id="formCheck-verifiedUser"
                                                            name="verified_user"
                                                            value={this.state.verified_user}
                                                            onChange={this.onChangeVerifiedUser}
                                                        />
                                                        <label
                                                            style={{cursor: "pointer"}}
                                                            className="form-check-label"
                                                            htmlFor="formCheck-verifiedUser"
                                                        >
                                                            Only verified user
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="col-lg-12">
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="formCheck-verifiedAccommodation"
                                                            name="verified_accommodation"
                                                            value={this.state.verified_accommodation}
                                                            onChange={this.onChangeVerifiedAccommodation}
                                                        />
                                                        <label
                                                            style={{cursor: "pointer"}}
                                                            className="form-check-label"
                                                            htmlFor="formCheck-verifiedAccommodation"
                                                        >
                                                            Only verified accommodation
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-row">
                                                <div className="col-lg-12">
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="formCheck-goingToMyCity"
                                                            name="go_to_my_city"
                                                            value={this.state.to_my_city}
                                                            onChange={this.onChangeGoingToMyCity}
                                                        />
                                                        <label
                                                            style={{cursor: "pointer"}}
                                                            className="form-check-label"
                                                            htmlFor="formCheck-goingToMyCity"
                                                        >
                                                            Only students going to my city
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    )}

                                    <div className="form-group text-center">
                                        <button
                                            className="btn btn-primary"
                                            style={{padding: "7px", marginTop: "20px"}}
                                        >
                                            Apply
                                        </button>
                                        <CheckButton
                                            style={{display: "none"}}
                                            ref={(c) => {
                                                this.checkBtn = c;
                                            }}
                                        />
                                    </div>
                                </Form>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="container-fluid">
                                {/*<div className="filterNotification">
                                    {this.state.message && (
                                        <div className="row">
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
                                        </div>
                                    )}
                                </div>*/}

                                {this.state.loading && (
                                    <div style={{textAlign: "center"}}>
                                        <br></br>
                                        <br></br>

                                        <Loader
                                            type="Puff"
                                            color="#00BFFF"
                                            height={200}
                                            width={200}
                                            visible={this.state.loading}
                                        />
                                    </div>
                                )}

                                {this.state.successful &&
                                this.state.listingData.length === 0 &&
                                !this.state.loading && (
                                    <React.Fragment>
                                        <div className="swapt-container listing-item">
                                            <div className="col-12 text-center">
                                                <strong>No Accommodation Found</strong>
                                                <div>*for testing only : all our dummy exchange students are going on exchange from 1.6.2020 - 31.12.2020*</div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                )}

                                {this.state.successful &&
                                this.state.listingData.length != 0 &&
                                !this.state.loading && (
                                    <React.Fragment>
                                        {this.state.listingComponents}

                                        <ReactPaginate
                                            previousLabel={"prev"}
                                            nextLabel={"next"}
                                            breakLabel={"..."}
                                            breakClassName={"break-me"}
                                            pageCount={this.state.pageCount}
                                            marginPagesDisplayed={2}
                                            pageRangeDisplayed={5}
                                            onPageChange={this.handlePageClick}
                                            containerClassName={"pagination"}
                                            subContainerClassName={"pages pagination"}
                                            activeClassName={"active"}
                                        />
                                    </React.Fragment>
                                )}
                            </div>
                        </div>

                        <div className="col-lg-3">
                            <div className="swapt-container">
                                {this.state.country && (
                                    <AccommodationListingCountryComponent
                                        country={this.state.country}
                                    ></AccommodationListingCountryComponent>
                                )}
                            </div>

                            {!this.state.isPremiumUser && (
                                <div className="swapt-container">
                                    <h5 className="text-center">Advertisement</h5>
                                    <div className="text-center">
                                        <img
                                            width="250"
                                            height="250"
                                            src="https://res.cloudinary.com/dikb9ev9w/image/upload/f_auto,q_auto/v1574252820/Flashban/250x250cyber"
                                            data-src="https://res.cloudinary.com/dikb9ev9w/image/upload/f_auto,q_auto/v1574252820/Flashban/250x250cyber"
                                            className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail lazyloaded"
                                            alt="Cyber Gif Ad Banner"
                                        />
                                        <img
                                            width="250"
                                            height="250"
                                            src="https://res.cloudinary.com/dikb9ev9w/image/upload/f_auto,q_auto/v1573455612/Flashban/250x250cloud"
                                            data-src="https://res.cloudinary.com/dikb9ev9w/image/upload/f_auto,q_auto/v1573455612/Flashban/250x250cloud"
                                            className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail lazyloaded"
                                            alt="Cloud Hosting Gif Ad banner"
                                        />
                                        <img
                                            width="250"
                                            height="250"
                                            src="https://res.cloudinary.com/dikb9ev9w/image/upload/f_auto,q_auto/v1573728617/Flashban/250x250watch"
                                            data-src="https://res.cloudinary.com/dikb9ev9w/image/upload/f_auto,q_auto/v1573728617/Flashban/250x250watch"
                                            className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail lazyloaded"
                                            alt=""
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    required = (value) => {
        if (!value) {
            return (
                <div className="alert alert-danger" role="alert">
                    This field is required!
                </div>
            );
        }
    };

    zipCode = (value) => {
        if (value.length < 0 || value.length > 10) {
            return (
                <div className="alert alert-danger" role="alert">
                    Value must be between 0 and 10 characters.
                </div>
            );
        }
        // COMMENTED OUT ZIP-CODE MIGHT CONTAIN LETTER.
        // if (value.length != 0 && !this.isNumber(value)) {
        //     return (
        //         <div className="alert alert-danger" role="alert">
        //             Value must be numeric.
        //         </div>
        //     );
        // }
    };

    streetName = (value) => {
        if (value.length != 0 && (value.length < 0 || value.length > 50)) {
            return (
                <div className="alert alert-danger" role="alert">
                    Value must be between 0 and 50 characters.
                </div>
            );
        }

        if (value.length != 0 && this.containsNumber(value)) {
            return (
                <div className="alert alert-danger" role="alert">
                    Value can't be numeric.
                </div>
            );
        }
    };

    streetNumber = (value) => {
        if (value.length != 0 && (value.length < 0 || value.length > 10)) {
            return (
                <div className="alert alert-danger" role="alert">
                    Value size can be at most 10.
                </div>
            );
        }
        //  // COMMENTED OUT STREET NUMBER MIGHT CONTAIN NUMBER.
        // if (value.length != 0 && !this.isNumber(value)) {
        //     return (
        //         <div className="alert alert-danger" role="alert">
        //             Value must be numeric.
        //         </div>
        //     );
        // }
    };

    isNumber(n) {
        return /^\+?(0|[1-9]\d*)$/.test(n);
    }

    containsNumber(n) {
        return /\d/.test(n);
    }
}
