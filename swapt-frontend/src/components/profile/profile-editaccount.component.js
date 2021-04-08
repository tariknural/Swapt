import React, {Component} from "react";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import Form from "react-validation/build/form";
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

const vpassword = value => {
    if (value.length < 6 || value.length > 40) {
        return (
            <div className="alert alert-danger" role="alert">
                The password must be between 6 and 40 characters.
            </div>
        );
    }
};

export class ProfileEditAccountComponent extends Component {
    constructor(props) {
        super(props);

        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeNewPassword = this.onChangeNewPassword.bind(this);
        this.onUploadImage = this.onUploadImage.bind(this);
        this.onUploadPdf = this.onUploadPdf.bind(this);

        // init profile_picture
        let profile_picture = '//ssl.gstatic.com/accounts/ui/avatar_2x.png'
        if (this.props.activeUser.profile_picture !== undefined) {
            profile_picture = this.props.activeUser.profile_picture
        }

        // get activeUser passed as props
        this.state = {
            activeUser: this.props.activeUser,
            successful: false,
            password: "",
            new_password: "",
            message: "",
            profile_picture: profile_picture,
            is_verified: this.props.activeUser.is_verified_exchange_student
        };
    }


    onSubmitForm(e) {
        e.preventDefault();

        this.setState({
            message: "",
            successful: false
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            UserService.updateUserPassword(
                this.state.password,
                this.state.new_password,
            ).then(
                response => {
                    this.setState({
                        message: response.data.message,
                        successful: true
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

    onUploadImage(e) {
        e.preventDefault();
        const formData = new FormData()
        formData.append('profile_picture', e.target.files[0])

        UserService.updateUserPicture(formData).then(
            response => {
                this.setState({
                    message: response.data.message,
                    successful: true,
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
                    message: response.data.message,
                    successful: true,
                    is_verified: response.data.user.is_verified_exchange_student
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

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onChangeNewPassword(e) {
        this.setState({
            new_password: e.target.value
        });
    }

    render() {
        const {activeUser} = this.state;
        return (
            <div className="swapt-container-white">
                <h3 className="mb-5">Account</h3>

                <img src={this.state.profile_picture} alt="profile-img" className="profile-img-card"/>
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

                        <div className="form-group">
                            <label htmlFor="change-picture"><strong>Profile Picture</strong></label>
                            <input name="change-picture" type="file" onChange={this.onUploadImage}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email"><strong>Email</strong></label>
                            <span name="email">
                                    {activeUser.email}
                                </span>
                        </div>

                        <div className="form-group">
                            <label htmlFor="status"><strong>Status</strong></label>
                            <div name="status">
                                {this.state.is_verified ? (
                                    <div className="text-success">Verified Exchange Student</div>
                                ) : (
                                    <React.Fragment>
                                        <div className="text-danger mb-1">Unverified Exchange Student</div>
                                        <div>Please upload your exchange student proof from your university</div>
                                        <input name="upload-pdf" type="file" onChange={this.onUploadPdf}/>
                                    </React.Fragment>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="current-password"><strong>Current Password</strong></label>
                            <Input
                                type="password"
                                className="form-control"
                                name="current-password"
                                value={this.state.password}
                                onChange={this.onChangePassword}
                                validations={[required, vpassword]}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="new-password"><strong>New Password</strong></label>
                            <Input
                                type="password"
                                className="form-control"
                                name="new-password"
                                value={this.state.new_password}
                                onChange={this.onChangeNewPassword}
                                validations={[required, vpassword]}
                            />
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
