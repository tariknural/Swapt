const db = require("../models");
const User = db.user;
const UserRole = db.userrole;
var bcrypt = require("bcryptjs");

const allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

const userBoard = (req, res) => {
    res.status(200).send("User Content.");
};


const premiumUserBoard = (req, res) => {
    res.status(200).send("premiumUser Content.");
};

/**
 * Function to get current active user based on token.
 * request userId is generated in authJwt.verifyToken()
 * @param req
 * @param res
 */
const getUser = (req, res) => {
    // req.userId is provided from middlewares/authJwt->verifyToken()
    User.findById(req.userId)
        .populate("home_university", "-__v")
        .populate("destination_university", "-__v")
        .populate("home_city", "-__v")
        .populate("destination_city", "-__v")
        .populate("roles", "-__v")
        .exec()
        .then(user => {

            if (!user) return res.status(404).json({
                error: 'Not Found',
                message: `User not found`
            });

            user = cleanUpUserData(user);
            res.status(200).json(user)

        })
        .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));
};

const getUserById = (req, res) => {
    User.findById(req.params.id)
        .exec()
        .then(user => {
            if (!user) return res.status(404).json({
                error: 'Not Found',
                message: `User not found`
            });

            user = cleanUpUserData(user);
            res.status(200).json(user);
        })
        .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));
};

const getUserPremiumStatus = (req, res) => {
    User.findById(req.userId)
        .populate("roles", "-__v")
        .exec()
        .then(user => {

            if (!user) return res.status(404).json({
                error: 'Not Found',
                message: `User not found`
            });

            let premiumStatus = false;

            user.roles.forEach(role => {
                if(role.name === 'premiumUser') premiumStatus = true;
            })

            res.status(200).json({premium:premiumStatus})

        })
        .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));
}

const setUserRole = (req, res) => {
    UserRole.findOne({name:req.params.role})
        .exec()
        .then(userRole => {

            User.findByIdAndUpdate(req.userId, {roles:[userRole._id]},{new: true})
                .exec()
                .then(user => {

                    if (!user) return res.status(404).json({
                        error: 'Not Found',
                        message: `User not found`
                    });

                    user = cleanUpUserData(user);
                    res.status(200).json(user)

                })
                .catch(error => res.status(500).json({
                    error: 'Internal Server Error',
                    message: error.message
                }));

        })
        .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));
}

const updateUser = (req, res) => {

    // check date, if end date smaller than start date
    let startDate = new Date(req.body.exchange_date_start);
    let endDate = new Date(req.body.exchange_date_end);

    if(endDate <= startDate) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: "End date must be later than start date"
        })
    }

    User.findByIdAndUpdate(req.userId,req.body,{new: true})
        .populate("home_university", "-__v")
        .populate("destination_university", "-__v")
        .populate("home_city", "-__v")
        .populate("destination_city", "-__v")
        .populate("roles", "-__v")
        .exec()
        .then(user => {

            if (!user) return res.status(404).json({
                error: 'Not Found',
                message: `User not found`
            });

            user = cleanUpUserData(user);
            res.status(200).json(user)

        })
        .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));
}

const updateUserPassword = (req, res) => {
    User.findById(req.userId)
        .populate("home_university", "-__v")
        .populate("destination_university", "-__v")
        .populate("home_city", "-__v")
        .populate("destination_city", "-__v")
        .populate("roles", "-__v")
        .select('+password')
        .exec((err, user) => {
            if (err) {
                res.status(500).send({message: err.errmsg});
                return;
            }

            if (!user) {
                return res.status(404).send({message: "User Not found."});
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Old Password!"
                });
            }

            user.password = bcrypt.hashSync(req.body.new_password, 8);
            user.save(err => {
                if (err) {
                    res.status(500).send({message: err.errmsg});
                    return;
                }

                res.status(200).send({message: "Password Changed!"});
            });
        });
}

const updateUserPicture = (req, res) => {
    User.findById(req.userId)
        .populate("home_university", "-__v")
        .populate("destination_university", "-__v")
        .populate("home_city", "-__v")
        .populate("destination_city", "-__v")
        .populate("roles", "-__v")
        .exec((err, user) => {
            if (err) {
                res.status(500).send({message: err.errmsg});
                return;
            }

            if (!user) {
                return res.status(404).send({message: "User Not found."});
            }

            if(req.fileValidationError) {
                res.status(406).send({message: req.fileValidationError});
                return;
            }

            const url = req.protocol + '://' + req.get('host');
            user.profile_picture = url + '/public/pictures/profile/' + req.file.filename;
            user.save(err => {
                if (err) {
                    res.status(500).send({message: err.errmsg});
                    return;
                }

                res.status(200).send({message: "Upload profile picture success", user:user});
            });
        });
}

const uploadUserVerificationDocument = (req, res) => {
    User.findById(req.userId)
        .populate("home_university", "-__v")
        .populate("destination_university", "-__v")
        .populate("home_city", "-__v")
        .populate("destination_city", "-__v")
        .populate("roles", "-__v")
        .exec((err, user) => {
            if (err) {
                res.status(500).send({message: err.errmsg});
                return;
            }

            if (!user) {
                return res.status(404).send({message: "User Not found."});
            }

            if(req.fileValidationError) {
                res.status(406).send({message: req.fileValidationError});
                return;
            }

            user.is_verified_exchange_student = true;
            // add verification file to db
            const url = req.protocol + '://' + req.get('host');
            user.verification_file = url + '/files/verifications/profile/' + req.file.filename;

            user.save(err => {
                if (err) {
                    res.status(500).send({message: err.errmsg});
                    return;
                }

                res.status(200).send({message: "Upload verification file successfull", user:user});
            });
        });
}

const cleanUpUserData = (userData) => {
    // with setting _id to undefined, frontend will get a random _id and not the real user._id for security reason
    // userData._id = undefined;
    userData.__v = undefined;
    return userData;
}

module.exports = {
    getUser,
    getUserById,
    getUserPremiumStatus,
    setUserRole,
    updateUser,
    updateUserPassword,
    updateUserPicture,
    allAccess,
    userBoard,
    premiumUserBoard,
    uploadUserVerificationDocument
};