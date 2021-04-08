import React, { Component } from "react";
import CountryService from "../services/country.service";
import {withRouter} from "react-router-dom";

import MapChart from "../components/map-chart";

export class CountrySelectionView extends Component {
    constructor(props) {
        super(props);

        this.onChangeCountry = this.onChangeCountry.bind(this);
        this.goToCountryInformation = this.goToCountryInformation.bind(this);
        this.changeCountry = this.changeCountry.bind(this);

        this.state = {
            country: this.props.country,
            countryList: []
        }
    }

    componentDidMount() {
        CountryService.getAllCountries().then(
            response => {
                this.setState({
                    countryList: response.data.sort((countryA, countryB) => {
                        if (countryA.name < countryB.name) return -1;
                        else if (countryA.name > countryB.name) return 1;
                        else return 0;
                    }),
                    country: response.data[1]
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
            }
        )
    }

    onChangeCountry(e) {
        this.setState({
            country: this.state.countryList.find(country => country._id === e.target.value)
        });
    }

    changeCountry(countryName) {
        this.setState({
            country: this.state.countryList.find(country => country.name === countryName)
        });
    }

    goToCountryInformation() {
        this.props.history.push("/country/" + this.state.country._id);
        window.location.reload();
    }


    render() {  
        return (
        <div className="container">
            <div className="swapt-container">

                <div className="mb-4" style={{border: "solid"}}>
                <MapChart changeCountry={this.changeCountry}/>
                </div>

                <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <div className="form-row align-items-center">
                        <div className="form-group col-md-1 col-sm-4">
                            <img className="img-thumbnail" src={this.state.country ? this.state.country.flag_picture : undefined}></img>
                        </div>
                        <div className="form-group col-md-4 col-sm-8">
                            <select className="form-control" name="country" onChange={this.onChangeCountry} value={this.state.country ? this.state.country._id : undefined}>{
                                this.state.countryList.map((country) => {
                                    return <option key={country._id} value={country._id}>{country.name}</option>
                                })
                            }</select>
                        </div>
                        <div className="form-group col-sm-2">
                            <button className="form-control btn btn-primary" onClick={this.goToCountryInformation}>Select</button>
                        </div>
                    </div>
                </div>

                {this.state.message && (
                    <div className="form-group">
                        <div className="alert alert-danger" role="alert">
                            {this.state.message}
                        </div>
                    </div>
                )}
            </div>
        </div> 
        );
    }
}

export default withRouter(CountrySelectionView);
