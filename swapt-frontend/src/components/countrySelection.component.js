import React, { Component } from "react";
import CountryService from "../services/country.service";

export class CountrySelection extends Component {
    constructor(props) {
        super(props);

        this.onChangeCountry = this.onChangeCountry.bind(this);

        this.state = {
            countryList: []
        }
    }

    componentDidMount() {
        CountryService.getAllCountries().then(
            response => {
                this.setState({
                    countryList: response.data
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
        let selectedCountry = this.state.countryList.find(country => country._id === e.target.value);
        this.props.onChangeCountry(selectedCountry);
    }

    render() {  
        return (
            <div className="container">
                <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <select className="form-control" name="country" onChange={this.onChangeCountry} value={this.props.country ? this.props.country._id : undefined}>{
                        this.state.countryList.map((country) => {
                            return <option key={country._id} value={country._id}>{country.name}</option>
                        })
                    }</select>
                </div>

                {this.state.message && (
                    <div className="form-group">
                        <div className="alert alert-danger" role="alert">
                            {this.state.message}
                        </div>
                    </div>
                )}
            </div> 
        );
    }
}
