import React, {Component} from "react";
import DatePicker from "react-datepicker";
import AuthService from "../services/auth.service";
import Input from "react-validation/build/input";
import "react-datepicker/dist/react-datepicker.css";
import CheckButton from "react-validation/build/button";
import Form from "react-validation/build/form";
import CityService from "../services/city.service";
import UniversityService from "../services/university.service";
import UserService from "../services/user.service";
import {ProfileEditAccommodationComponent} from "../components/profile/profile-editaccommodation.component";

export class UserSetupView extends Component {
    constructor(props) {
        super(props);

        this.onChangeHomeUniversity = this.onChangeHomeUniversity.bind(this);
        this.onChangeDestinationUniversity = this.onChangeDestinationUniversity.bind(this);
        this.onChangeHomeCity = this.onChangeHomeCity.bind(this);
        this.onChangeDestinationCity = this.onChangeDestinationCity.bind(this);
        this.onChangeStartDate = this.onChangeStartDate.bind(this);
        this.onChangeEndDate = this.onChangeEndDate.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.submitStepTwo = this.submitStepTwo.bind(this);
        this.submitStepThree = this.submitStepThree.bind(this);
        this.submitStepFour = this.submitStepFour.bind(this);
        this.onUploadImage = this.onUploadImage.bind(this);
        this.onUploadPdf = this.onUploadPdf.bind(this);

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

        // if those parameters set already, redirect to listing
        if(currentUser.destination_city !== undefined &&
            currentUser.exchange_date_start !== undefined &&
            currentUser.exchange_date_end !== undefined) {
            /*this.props.history.push("/listing");
            window.location.reload();*/
        }

        // init profile_picture
        let profile_picture = '//ssl.gstatic.com/accounts/ui/avatar_2x.png'
        if (currentUser.profile_picture !== undefined) {
            profile_picture = currentUser.profile_picture
        }

        //set basic state
        this.state = {
            currentUser: currentUser,
            currentStep: 1,
            loadingWidth:'25%',
            profile_picture: profile_picture,
            home_university: "",
            home_city: "",
            destination_university: "",
            destination_city: "",
            start_date: new Date(),
            end_date: new Date(),
            loading: false,
            error_message: "",
            pdf_message: "",
            pdf_successful: false,

            //dropdown state
            home_cities: [],
            destination_cities: [],
            home_universities: [],
            destination_universities: [],
        };
    }

    componentDidMount() {
        // get city list
        CityService.getAllCities().then(
            response => {
                this.setState({
                    home_cities: response.data,
                    destination_cities: response.data,
                    home_city:response.data[0]._id,
                    destination_city:response.data[1]._id
                });

                // get university list
                //home university list
                UniversityService.getAllUniversitiesByCityId(this.state.home_city).then(
                    response => {
                        this.setState({
                            home_universities: response.data,
                            home_university:response.data[0]._id,
                        });
                    },
                    error => {
                        this.setState({
                            content:
                                (error.response &&
                                    error.response.data &&
                                    error.response.data.message) ||
                                error.message ||
                                error.toString()
                        });
                    }
                );

                //destination city list
                UniversityService.getAllUniversitiesByCityId(this.state.destination_city).then(
                    response => {
                        this.setState({
                            destination_universities: response.data,
                            destination_university:response.data[0]._id,
                        });
                    },
                    error => {
                        this.setState({
                            content:
                                (error.response &&
                                    error.response.data &&
                                    error.response.data.message) ||
                                error.message ||
                                error.toString()
                        });
                    }
                );
            },
            error => {
                this.setState({
                    content:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString()
                });
            }
        );
    }

    onChangeHomeUniversity(e) {
        this.setState({
            home_university: e.target.value
        });
    }

    onChangeDestinationUniversity(e) {
        this.setState({
            destination_university: e.target.value
        });
    }

    onChangeHomeCity(e) {
        this.setState({
            home_city: e.target.value
        });

        UniversityService.getAllUniversitiesByCityId(e.target.value).then(
            response => {
                this.setState({
                    home_universities: response.data
                });
            },
            error => {
                this.setState({
                    content:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString()
                });
            }
        );
    }

    onChangeDestinationCity(e) {
        this.setState({
            destination_city: e.target.value
        });

        UniversityService.getAllUniversitiesByCityId(e.target.value).then(
            response => {
                this.setState({
                    destination_universities: response.data
                });
            },
            error => {
                this.setState({
                    content:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString()
                });
            }
        );
    }

    onChangeStartDate = date => {
        this.setState({
            start_date: date
        });
    };

    onChangeEndDate = date => {
        this.setState({
            end_date: date
        });
    };

    onUploadImage(e) {
        e.preventDefault();
        const formData = new FormData()
        formData.append('profile_picture', e.target.files[0])

        UserService.updateUserPicture(formData).then(
            response => {
                this.setState({
                    profile_picture: response.data.user.profile_picture
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

    onUploadPdf(e) {
        e.preventDefault();

        const formData = new FormData()
        formData.append('profile_verification', e.target.files[0])

        UserService.uploadUserVerificationFile(formData).then(
            response => {
                this.setState({
                    pdf_message: response.data.message,
                    pdf_successful: true,
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
                    pdf_successful: false,
                    pdf_message: resMessage
                });
            }
        );
    }

    submitForm(e) {
        e.preventDefault();

        this.setState({
            error_message: "",
            loading: true
        });

        if(this.state.home_city === this.state.destination_city) {
            this.setState({
                error_message: "Home city cannot be the same like destination city",
                loading: false
            });
        }
        else {
            this.form.validateAll();

            this.setState({
                loading: false
            });

            const userData = {
                home_university: this.state.home_university,
                home_city: this.state.home_city,
                destination_university: this.state.destination_university,
                destination_city: this.state.destination_city,
                exchange_date_start: this.state.start_date,
                exchange_date_end: this.state.end_date
            };

            if (this.checkBtn.context._errors.length === 0) {
                UserService.updateUserData(userData).then(
                    response => {
                        this.setState({currentUser:response.data,currentStep:2,loadingWidth:'50%',})
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
                    }
                );
            } else {
                this.setState({
                    loading: false
                });
            }
        }
    }

    submitStepTwo() {
        this.setState({currentStep:3,loadingWidth:'75%',})
    }

    submitStepThree() {
        this.setState({currentStep:4,loadingWidth:'99%',})
    }

    submitStepFour() {
        //redirect to listing page
        this.props.history.push("/listing");
        window.location.reload();
    }

    render() {
        return (
            <React.Fragment>
                <header className="mb-5">
                    <div style={{fontFamily:'Gordita Medium', width: '100%', fontSize:'55px', textAlign:'center', fontWeight:'bold'}}>
                        <span>Hello {this.state.currentUser.first_name}!</span>
                    </div>
                    <div style={{width: '100%', fontSize:'22px', textAlign:'center'}}>
                        <span>just a little bit more and you can start using Swapt</span>
                    </div>
                </header>
                <div className="container">
                    <div className="swapt-container">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="progress">
                                    <div className="progress-bar progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" style={{width: this.state.loadingWidth}}></div>
                                </div>

                                {this.state.currentStep === 1 && (
                                    <div className="step-1">
                                        <div style={{textAlign:'center'}} className="mt-5">
                                            <h5>{this.state.currentStep} - Where are you currently studying, where will you do your exchange and how long will it be for?</h5>
                                        </div>
                                        <div className="col-sm-5 col-centered swapt-container-white mt-5 mb-5">
                                            {this.state.error_message && (
                                                <div className="form-group">
                                                    <div className="alert alert-danger" role="alert">
                                                        {this.state.error_message}
                                                    </div>
                                                </div>
                                            )}

                                            <Form
                                                onSubmit={this.submitForm}
                                                ref={c => {
                                                    this.form = c;
                                                }}
                                            >
                                                <div className="form-group">
                                                    <label htmlFor="home_city">Home City</label>
                                                    <select className="form-control" name="home_city" onChange={this.onChangeHomeCity} value={this.state.home_city}>{
                                                        this.state.home_cities.map((city) => {
                                                            return <option key={city._id} value={city._id}>{city.name}</option>
                                                        })
                                                    }</select>
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="home_university">Home University</label>
                                                    <select className="form-control" name="home_university" onChange={this.onChangeHomeUniversity} value={this.state.home_university}>{
                                                        this.state.home_universities.map((university) => {
                                                            return <option key={university._id} value={university._id}>{university.name}</option>
                                                        })
                                                    }</select>
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="destination_city">Destination City</label>
                                                    <select className="form-control" name="destination_city" onChange={this.onChangeDestinationCity} value={this.state.destination_city}>{
                                                        this.state.destination_cities.map((city) => {
                                                            return <option key={city._id} value={city._id}>{city.name}</option>
                                                        })
                                                    }</select>
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="destination_university">Destination University</label>
                                                    <select className="form-control" name="destination_university" onChange={this.onChangeDestinationUniversity} value={this.state.destination_university}>{
                                                        this.state.destination_universities.map((university) => {
                                                            return <option key={university._id} value={university._id}>{university.name}</option>
                                                        })
                                                    }</select>
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="start_date">Start Date</label>
                                                    <DatePicker
                                                        className="form-control"
                                                        name="start_date"
                                                        selected={this.state.start_date}
                                                        onChange={this.onChangeStartDate}
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="end_date">End Date</label>
                                                    <DatePicker
                                                        className="form-control"
                                                        name="end_date"
                                                        selected={this.state.end_date}
                                                        onChange={this.onChangeEndDate}
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <button
                                                        className="btn btn-primary btn-block"
                                                        disabled={this.state.loading}
                                                    >
                                                        {this.state.loading && (
                                                            <span className="spinner-border spinner-border-sm"></span>
                                                        )}
                                                        <span>Next</span>
                                                    </button>
                                                </div>

                                                <CheckButton
                                                    style={{display: "none"}}
                                                    ref={c => {
                                                        this.checkBtn = c;
                                                    }}
                                                />
                                            </Form>
                                        </div>
                                    </div>
                                )}

                                {this.state.currentStep === 2 && (
                                    <div className="step-2">
                                        <div style={{textAlign:'center'}} className="mt-5">
                                            <h5>{this.state.currentStep} - Upload a profile picture</h5>
                                        </div>
                                        <div className="col-sm-5 col-centered swapt-container-white mt-5 mb-5">
                                            <img src={this.state.profile_picture} alt="profile-img" className="profile-img-card"/>
                                            <Form onSubmit={this.submitStepTwo}>
                                                <div className="form-group">
                                                    <input name="change-picture" type="file" onChange={this.onUploadImage}/>
                                                </div>

                                                <button className="btn btn-primary btn-block">
                                                    <span>Next</span>
                                                </button>
                                            </Form>
                                        </div>
                                    </div>
                                )}

                                {this.state.currentStep === 3 && (
                                    <div className="step-3">
                                        <div style={{textAlign:'center'}} className="mt-5">
                                            <h5>{this.state.currentStep} - Upload a document that states you will be or are an exchange student</h5>
                                        </div>
                                        <div className="col-sm-5 col-centered swapt-container-white mt-5 mb-5">

                                            {this.state.pdf_message && (
                                                <div className="form-group">
                                                    <div
                                                        className={
                                                            this.state.pdf_successful
                                                                ? "alert alert-success"
                                                                : "alert alert-danger"
                                                        }
                                                        role="alert"
                                                    >
                                                        {this.state.pdf_message}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="form-group">
                                                <input name="upload-pdf" type="file" onChange={this.onUploadPdf}/>
                                            </div>
                                            <button
                                                onClick={this.submitStepThree}
                                                className="btn btn-primary btn-block"
                                            >
                                                <span>Next</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {this.state.currentStep === 4 && (
                                    <div className="step-4">
                                        <div style={{textAlign:'center'}} className="mt-5">
                                            <h5>{this.state.currentStep} - Would you like to list your accommodation now?</h5>
                                        </div>
                                        <div className="col-sm-12 col-centered swapt-container-white mt-5 mb-5 text-center">
                                            <ProfileEditAccommodationComponent activeUser={this.state.currentUser} />

                                            <button
                                                onClick={this.submitStepFour}
                                                className="btn btn-success"
                                            >
                                                <span>Finish Setup Process</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
