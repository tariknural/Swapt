import React, { Component } from "react";
import {withRouter} from 'react-router-dom';

class AccommodationListingCountryComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      country: this.props.country
    };
    this.goToCountryInformation = this.goToCountryInformation.bind(this);
  }

  componentDidMount() {}

  goToCountryInformation() {
    this.props.history.push("/country/" + this.state.country._id);
    window.location.reload();
  }

  render() {
    return (
      <div className="col text-center">
        <h5 className="text-center ">
            {this.state.country.name}
        </h5>
        <img
          src={this.state.country.flag_picture}
          style={{width:"50%"}}
        />
        <div className="row text-center">
          <div className="col" style={{ margin: "10px", marginTop: "30px" }}>
            <button
              className="btn btn-primary"
              type="button"
              onClick={this.goToCountryInformation}
            >
              More Information
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(AccommodationListingCountryComponent);
