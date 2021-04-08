import React, { Component } from "react";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import Form from "react-validation/build/form";
import AccommodationService from "../../services/accommodation.service"
import CountryService from "../../services/country.service"
import ImageGallery from 'react-image-gallery';
import UserService from "../../services/user.service";


const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

export class ProfileEditAccommodationComponent extends Component {
    constructor(props) {
        super(props);

        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.onPicturesChange = this.onPicturesChange.bind(this);
        this.onChangeStreet = this.onChangeStreet.bind(this);
        this.onChangeStreetNumber = this.onChangeStreetNumber.bind(this);
        this.onChangeAddInfo = this.onChangeAddInfo.bind(this);
        this.onChangeRent = this.onChangeRent.bind(this);
        this.onChangeZipCode = this.onChangeZipCode.bind(this);
        this.onChangeSize = this.onChangeSize.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onUploadPdf = this.onUploadPdf.bind(this);
        this.onChangeIsActive = this.onChangeIsActive.bind(this);

        // get activeUser passed as props
        this.state = {
            activeUser: this.props.activeUser,
            successful: false,
            message: "",
            accommodation: [],
            accommodation_pictures: [],
            accommodation_verified: false,
            form_street: "",
            form_streetnr: "",
            form_addinfo: "",
            form_zipcode: "",
            form_size: "",
            form_rent: "",
            form_city: this.props.activeUser.home_city.name,
            form_country: "",
            form_description: "",
            form_pictures: [],
            form_is_active: false,
        };
    }

    componentDidMount() {
        AccommodationService.getUserAccommodation().then(
            response => {
                if(Array.isArray(response.data) && response.data.length) {
                    let accommodationPictures = [];
                    response.data[0].pictures.forEach(picture_url => {
                        let singlePicture = {original:picture_url,thumbnail:picture_url};
                        accommodationPictures.push(singlePicture);
                    })

                    this.setState({
                        accommodation: response.data,
                        accommodation_verified: response.data[0].is_verified_by_landlord,
                        accommodation_pictures: accommodationPictures,
                        form_street: response.data[0].street,
                        form_streetnr: response.data[0].street_number,
                        form_addinfo: response.data[0].additional_information,
                        form_zipcode: response.data[0].zip_code,
                        form_size: response.data[0].size,
                        form_rent: response.data[0].rent_per_month,
                        form_description: response.data[0].accommodation_description,
                        form_city: response.data[0].city.name,
                        form_country: response.data[0].country.name,
                        form_is_active: response.data[0].is_active
                    });
                }
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

        CountryService.getCountryById(this.state.activeUser.home_city.country).then(
            response => {
                this.setState({
                    form_country: response.data.name
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

    onSubmitForm(e) {
        e.preventDefault();

        this.setState({
            message: "",
            successful: false
        });

        this.form.validateAll();

        const accommodationData = new FormData();
        // take data from the forms
        if(this.state.form_street !== '') accommodationData.append('street', this.state.form_street);
        if(this.state.form_streetnr !== '') accommodationData.append('street_number', this.state.form_streetnr);
        if(this.state.form_zipcode !== '') accommodationData.append('zip_code', this.state.form_zipcode);
        if(this.state.form_addinfo !== '') accommodationData.append('additional_information', this.state.form_addinfo);
        if(this.state.form_size !== '') accommodationData.append('size', this.state.form_size);
        if(this.state.form_rent !== '') accommodationData.append('rent_per_month', this.state.form_rent);
        if(this.state.form_description !== '') accommodationData.append('accommodation_description', this.state.form_description);
        // show accommodation in listing
        accommodationData.append('is_active', this.state.form_is_active);

        // for city and country we take it from user home city object
        accommodationData.append('city', this.state.activeUser.home_city._id);
        accommodationData.append('country', this.state.activeUser.home_city.country);

        // append uploaded pictures
        for (let i = 0; i < this.state.form_pictures.length; i++) {
            accommodationData.append("accommodation_pictures", this.state.form_pictures[i], this.state.form_pictures[i].name);
        }

        if (this.checkBtn.context._errors.length === 0) {

            // if there is no acoomodation yet, we will create one, else update the one
            if(this.state.accommodation[0] === undefined) {

                // set user id for saving it in the backend
                accommodationData.append('user', this.state.activeUser._id);

                AccommodationService.addAccommodation(accommodationData).then(
                    response => {
                        let accommodationPictures = [];
                        response.data.pictures.forEach(picture_url => {
                            let singlePicture = {original:picture_url,thumbnail:picture_url};
                            accommodationPictures.push(singlePicture);
                        })

                        this.setState({
                            message: 'Create new accommodation successfully',
                            successful: true,
                            accommodation_pictures: accommodationPictures
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
            else {

                // set id off acommodation to update
                accommodationData.append('_id', this.state.accommodation[0]._id);

                AccommodationService.updateAccommodation(accommodationData).then(
                    response => {
                        let accommodationPictures = [];
                        response.data.pictures.forEach(picture_url => {
                            let singlePicture = {original:picture_url,thumbnail:picture_url};
                            accommodationPictures.push(singlePicture);
                        })

                        this.setState({
                            message: 'Update successfull',
                            successful: true,
                            accommodation_pictures: accommodationPictures
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

        }
    }

    onChangeStreet(e) {
        this.setState({
            form_street: e.target.value
        });
    }

    onChangeStreetNumber(e) {
        this.setState({
            form_streetnr: e.target.value
        });
    }

    onChangeAddInfo(e) {
        this.setState({
            form_addinfo: e.target.value
        });
    }

    onChangeZipCode(e) {
        this.setState({
            form_zipcode: e.target.value
        });
    }

    onChangeSize(e) {
        this.setState({
            form_size: e.target.value
        });
    }

    onChangeRent(e) {
        this.setState({
            form_rent: e.target.value
        });
    }

    onChangeDescription(e) {
        this.setState({
            form_description: e.target.value
        });
    }

    onChangeIsActive(e) {
        this.setState({
            form_is_active: e.target.checked ? true : false,
        });
    }

    onPicturesChange(e) {
        e.preventDefault();
        this.setState(
            { form_pictures: e.target.files
            })
    }

    onUploadPdf(e) {
        e.preventDefault();


        if(this.state.accommodation[0] === undefined) {
            this.setState({
                successful: false,
                message: "Please submit your accommodation first before uploading the verification file"
            });
        }
        else {
            const formData = new FormData();
            formData.append('_id', this.state.accommodation[0]._id);
            formData.append('accommodation_verification', e.target.files[0]);

            AccommodationService.uploadAccommodationVerificationFile(formData).then(
                response => {
                    this.setState({
                        message: response.data.message,
                        successful: true,
                        accommodation_verified: response.data.verified
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

    }

    render() {
        return (
            <div className="swapt-container-white">
                <h3 className="mb-5">Accommodation</h3>

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

                        <div className="form-group row mt-5 mb-5">
                            <div className="col-sm-12"><h5>Verification Status</h5></div>
                            <div className="col-sm-12">
                                <div name="status">
                                    {this.state.accommodation_verified ? (
                                        <div className="text-success">Verified Accommodation</div>
                                    ) : (
                                        <React.Fragment>
                                            <div className="text-danger mb-1"><strong>Unverified Accommodation</strong></div>
                                            <div>Please upload a consent document from your landlord</div>
                                            <input name="upload-pdf" type="file" onChange={this.onUploadPdf}/>
                                        </React.Fragment>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="form-group row text-left">
                            <div className="col-sm-12 text-center"><h5>Address</h5></div>
                            <div className="col-sm-8">
                                <label><strong>Street</strong></label>
                                <input name="address-street" type="text" className="form-control" value={this.state.form_street} onChange={this.onChangeStreet}/>
                            </div>
                            <div className="col-sm-4">
                                <label><strong>Street Number</strong></label>
                                <input name="address-street-nr" type="text" className="form-control" value={this.state.form_streetnr} onChange={this.onChangeStreetNumber}/>
                            </div>
                            <div className="col-sm-8">
                                <label><strong>Zip Code</strong></label>
                                <input name="address-street-zipcode" type="text" className="form-control" value={this.state.form_zipcode} onChange={this.onChangeZipCode}/>
                            </div>
                            <div className="col-sm-4">
                                <label><strong>City</strong></label>
                                <label>{this.state.form_city}</label>
                            </div>
                            <div className="col-sm-12">
                                <label><strong>Country</strong></label>
                                <label>{this.state.form_country}</label>
                            </div>
                            <div className="col-sm-12">
                                <label><strong>Additional Information</strong></label>
                                <input name="address-street-addinfo" type="text" className="form-control" value={this.state.form_addinfo} onChange={this.onChangeAddInfo}/>
                            </div>

                        </div>

                        <div className="form-group row text-left mt-5">
                            <div className="col-sm-12 text-center"><h5>Accommodation Details</h5></div>
                            <div className="col-sm-12">
                                <label
                                    style={{cursor: "pointer"}}
                                    htmlFor="formCheck-showInListing"
                                >
                                    <strong>Show Accommodation In Listing</strong>
                                </label>
                                <div className="input-group">
                                    <input
                                        type="checkbox"
                                        id="formCheck-showInListing"
                                        name="is_active"
                                        value={this.state.form_is_active}
                                        onChange={this.onChangeIsActive}
                                        checked={this.state.form_is_active}
                                    />
                                    {/*<span>Please uncheck this if you already have accommodation swap partner</span>*/}
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <label><strong>Size</strong></label>
                                <div className="input-group">
                                    <input name="accommodation-size" type="text" className="form-control" placeholder="Size" value={this.state.form_size} onChange={this.onChangeSize}/>
                                    <div className="input-group-append">
                                        <span className="input-group-text">m<sup>2</sup></span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <label><strong>Rent per Month</strong></label>
                                <div className="input-group">
                                    <input name="accommodation-rent" type="text" className="form-control" placeholder="Rent per Month" value={this.state.form_rent} onChange={this.onChangeRent}/>
                                    <div className="input-group-append">
                                        <span className="input-group-text">€</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <label><strong>Description</strong></label>
                                <textarea style={{height:"200px"}} name="accommodation-description" type="text" className="form-control" placeholder="Description" value={this.state.form_description} onChange={this.onChangeDescription}></textarea>
                            </div>
                            {this.state.accommodation_pictures.length > 0 && (
                                <div className="col-sm-12">
                                    <label><strong>Pictures</strong></label>
                                    <ImageGallery items={this.state.accommodation_pictures} />
                                </div>
                            )}
                            <div className="col-sm-12">
                                <label><strong>Upload Pictures</strong></label>
                                <input type="file" name="accommodation-pictures" multiple onChange={this.onPicturesChange}/>
                            </div>

                        </div>

                        <div className="form-group">
                            <button className="btn btn-primary">Save</button>
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
