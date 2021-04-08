import React, { Component } from "react";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import Form from "react-validation/build/form";
import UserService from "../../services/user.service";
import CityService from "../../services/city.service";
import UniversityService from "../../services/university.service";
import DatePicker from "react-datepicker";
import AuthService from "../../services/auth.service";

export class ProfileEditPreferencesComponent extends Component {
    constructor(props) {
        super(props);

        this.onChangeHomeUniversity = this.onChangeHomeUniversity.bind(this);
        this.onChangeDestinationUniversity = this.onChangeDestinationUniversity.bind(this);
        this.onChangeHomeCity = this.onChangeHomeCity.bind(this);
        this.onChangeDestinationCity = this.onChangeDestinationCity.bind(this);
        this.onChangeStartDate = this.onChangeStartDate.bind(this);
        this.onChangeEndDate = this.onChangeEndDate.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);

        const userSession = AuthService.getUserSession();

        if (userSession) {
            this.state = {
                activeUser: userSession.activeUser,
                displayComponent: 'edit_account',
                successful: false,
                home_university: userSession.activeUser.home_university._id,
                home_city: userSession.activeUser.home_city._id,
                destination_university: userSession.activeUser.destination_university._id,
                destination_city: userSession.activeUser.destination_city._id,
                start_date: new Date(userSession.activeUser.exchange_date_start),
                end_date: new Date(userSession.activeUser.exchange_date_end),
                loading: false,
                error_message: "",

                //dropdown state
                home_cities: [],
                destination_cities: [],
                home_universities: [],
                destination_universities: [],
            };
        } else {
            this.props.history.push("/");
            window.location.reload();
        }
    }

    componentDidMount() {
        // get city list
        CityService.getAllCities().then(
            response => {
                this.setState({
                    home_cities: response.data,
                    destination_cities: response.data
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

        // get university list
        //home university list
        UniversityService.getAllUniversitiesByCityId(this.state.home_city).then(
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

        //destination city list
        UniversityService.getAllUniversitiesByCityId(this.state.destination_city).then(
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



    onSubmitForm(e) {
        e.preventDefault();

        this.setState({
            message: "",
            successful: false,
            loading: true,
        });

        if(this.state.home_city === this.state.destination_city) {
            this.setState({
                message: "Home city cannot be the same like destination city",
                successful: false,
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
                        this.setState({
                            message: "Update Successfull",
                            successful: true,
                            loading: false,
                            activeUser: response.data
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
                            message: resMessage,
                            loading: false,
                        });
                    }
                );
            } else {
                this.setState({
                    successful: false,
                    message: "Please check your input",
                    loading: false,
                });
            }
        }


    }

    render() {
        const {activeUser} = this.state;
        return (
            <div className="swapt-container-white">
                <h3 className="mb-5">Preferences</h3>

                <Form
                    onSubmit={this.onSubmitForm}
                    ref={c => {
                        this.form = c;
                    }}
                >
                    <div>
                        {this.state.message && (
                            <div className="form-group">
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

                        <h5>Home</h5>
                        <div className="form-group">
                            <label htmlFor="home_city">City</label>
                            <select className="form-control" name="home_city" onChange={this.onChangeHomeCity} value={this.state.home_city}>{
                                this.state.home_cities.map((city) => {
                                    return <option key={city._id} value={city._id}>{city.name}</option>
                                })
                            }</select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="home_university">University</label>
                            <select className="form-control" name="home_university" onChange={this.onChangeHomeUniversity} value={this.state.home_university}>{
                                this.state.home_universities.map((university) => {
                                    return <option key={university._id} value={university._id}>{university.name}</option>
                                })
                            }</select>
                        </div>

                        <h5>Destination</h5>
                        <div className="form-group">
                            <label htmlFor="destination_city">City</label>
                            <select className="form-control" name="destination_city" onChange={this.onChangeDestinationCity} value={this.state.destination_city}>{
                                this.state.destination_cities.map((city) => {
                                    return <option key={city._id} value={city._id}>{city.name}</option>
                                })
                            }</select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="destination_university">University</label>
                            <select className="form-control" name="destination_university" onChange={this.onChangeDestinationUniversity} value={this.state.destination_university}>{
                                this.state.destination_universities.map((university) => {
                                    return <option key={university._id} value={university._id}>{university.name}</option>
                                })
                            }</select>
                        </div>

                        <h5>Exchange Duration</h5>
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
                                className="btn btn-primary"
                                disabled={this.state.loading}
                            >
                                {this.state.loading && (
                                    <span className="spinner-border spinner-border-sm"></span>
                                )}
                                <span>Save</span>
                            </button>
                        </div>
                    </div>

                    <CheckButton
                        style={{display: "none"}}
                        ref={c => {
                            this.checkBtn = c;
                        }}
                    />
                </Form>
            </div>
        );
    }
}
