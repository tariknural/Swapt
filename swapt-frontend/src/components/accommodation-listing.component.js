import React, { Component } from "react";
import { Link } from "react-router-dom";
import verifiedImage from "../assets/images/verified-user.png";

class AccommodationListingComponent extends Component {
  constructor(props) {
    super(props);

      // init profile_picture
      let profile_picture = '//ssl.gstatic.com/accounts/ui/avatar_2x.png'
      if(this.props.listingData.user.profile_picture !== undefined) {
          profile_picture = this.props.listingData.user.profile_picture
      }

    this.state = {
      accommodationDetailUrl: "/accommodation/",
      listingData : this.props.listingData,
      accommodationDetailUrlId: this.props.listingData._id,
        profile_picture:profile_picture
    };
  }

  componentDidMount() {

  }

  render() {
    return (
        <div className="swapt-container listing-item">
            <Link to={this.state.accommodationDetailUrl + this.state.accommodationDetailUrlId}>
                <div className="row">
                    <div className="col-sm-2">
                        <img className="rounded-circle img-fluid" src={this.state.profile_picture}/>
                    </div>
                    <div className="col-sm-7">
                        <h4 style={{ width: "100%" }}>
                            {this.state.listingData.user.first_name} {this.state.listingData.user.last_name}
                            {this.props.listingData.user.is_verified_exchange_student &&
                            <img className="verified-user-logo" src={verifiedImage}/>}
                        </h4>
                        <div className="mb-3">
                            {this.state.listingData.additional_information}
                        </div>
                        <div className="size">
                            {this.state.listingData.size} m<sup>2</sup>
                        </div>
                        <div className="price">
                            {this.state.listingData.rent_per_month} € / Month
                        </div>
                    </div>
                    <div className="col-sm-3">
                        <img src={this.state.listingData.pictures[0]} style={{ width: "100%", height: "100%" }}/>
                    </div>
                </div>
            </Link>
        </div>
    );
  }
}

export default AccommodationListingComponent;
