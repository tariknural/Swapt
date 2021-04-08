const mongoose = require("mongoose");
const db = require("../models");
const Accommodation = db.accommodation;
const User = db.user;
const AccommodationDetailService = require("../services/accommodation.detail.service");

/**
 * Function to accommodation list per active user.
 * @param req
 * @param res
 */
const getAccommodationListForUser = (req, res) => {
    // user id generated from verifyToken
    User.findById(req.userId).exec()
        .then(user => {

            if (!user) return res.status(404).json({
                error: 'Not Found',
                message: `User not found`
            });

            /**
             * Join Accommodation with user.
             * Equivalent with =
             * SELECT *
             * FROM accommodations
             * INNER JOIN users
             * ON users._id = accommodations.user
             * WHERE accommodations.city = 'user.destination_city'
             * AND users.exchange_date_start >= 'user.exchange_date_start';
             * AND users.exchange_date_end <= 'user.exchange_date_end';
             */
            Accommodation.aggregate()
                .lookup({ from: 'users', localField: 'user', foreignField: '_id', as: 'users' })
                .match({
                    'city' : mongoose.Types.ObjectId(user.destination_city),
                    'users.exchange_date_start' : {$gte : user.exchange_date_start},
                    'users.exchange_date_end' : {$lte : user.exchange_date_end},
                })
                .exec()
                .then(accommodations => {
                    if (!accommodations) return res.status(404).json({
                        error: 'Not Found',
                        message: `Accommodation not found`
                    });

                    res.status(200).json(accommodations)
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
};

/**
 * Function to get Accommodation by id.
 * @param req
 * @param res
 */
const getAccommodationById = (req, res) => {
    Accommodation.findById(req.params.id)
        .populate("user", "-__v")
        .populate("city", "-__v")
        .populate("country", "-__v")
        .exec()
        .then(accommodation => {

            if (!accommodation) return res.status(404).json({
                error: 'Not Found',
                message: `User not found`
            });

            res.status(200).json(accommodation)

        })
        .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));
};

/**
 * Function to create accommodation
 *
 * @param req
 * @param res
 */
const addAccommodation = (req, res) => {

    // add pictures to body for saving
    if (req.files.length > 0) {
        const url = req.protocol + '://' + req.get('host');
        req.body.pictures = [];
        req.files.forEach(file => {
            req.body.pictures.push(url + '/public/pictures/accommodation/' + file.filename);
        })
    }


    Accommodation.create(req.body)
        .then(accommodation => {

            if (!accommodation) return res.status(500).json({
                error: 'Internal Server Error',
                message: `Accommodation cannot be created`
            });

            res.status(200).json(accommodation)

        })
        .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));
}

const getAccommodationDetailById = (req,res) => {
    AccommodationDetailService.getAccommodationDetailById(req.params.id)
    .then(result => {
        if (!result)
            return res.status(200).json(null);
          /*return res.status(404).json({
            error: "Accommodation Detail Not Found",
            message: `Detail could not retrieved`,
          });*/
        res.status(200).json(result);
    }).catch(error => {
        res.status(500).json({
            error: "Internal Server Error",
            message: error.message,
          })
    })
}

const getUserAccommodation = (req,res) => {

    Accommodation.find({
        user: mongoose.Types.ObjectId(req.userId)
    }).populate('city')
        .populate('country')
        .exec()
        .then(accommodations => {

            if (!accommodations) return res.status(404).json({
                error: 'Not Found',
                message: `No accommodation not found`
            });

            res.status(200).json(accommodations)

        })
        .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));
}

/**
 * Get accommodation of given user
 */
const getAccommodation = (req,res) => {
    Accommodation.find({
        user: mongoose.Types.ObjectId(req.params.id)
    })
        .populate("user")
    .exec()
    .then(accommodations => {
        if (!accommodations) res.status(404).json({
            error: 'Not Found',
            message: `No accommodation not found`
        });

        res.status(200).json(accommodations)
    })
    .catch(error => res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
    }));
}

const updateAccommodation = (req, res) => {

    // add pictures to body for saving
    if (req.files.length > 0) {
        const url = req.protocol + '://' + req.get('host');
        req.body.pictures = [];
        req.files.forEach(file => {
            req.body.pictures.push(url + '/public/pictures/accommodation/' + file.filename);
        })
    }

    Accommodation.findByIdAndUpdate(req.body._id,req.body,{new: true}).exec()
        .then(accommodation => {

            if (!accommodation) return res.status(404).json({
                error: 'Not Found',
                message: `Accommodation not found`
            });

            res.status(200).json(accommodation)

        })
        .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));
}

const uploadAccommodationVerificationDocument = (req, res) => {
    Accommodation.findById(req.body._id)
        .exec((err, accommodation) => {
            if (err) {
                res.status(500).send({message: err.errmsg});
                return;
            }

            if (!accommodation) {
                return res.status(404).send({message: "Accommodation Not found."});
            }

            if(req.fileValidationError) {
                res.status(406).send({message: req.fileValidationError});
                return;
            }

            accommodation.is_verified_by_landlord = true;

            // add verification file to db
            const url = req.protocol + '://' + req.get('host');
            accommodation.verification_file = url + '/files/verifications/accommodation/' + req.file.filename;

            accommodation.save(err => {
                if (err) {
                    res.status(500).send({message: err.errmsg});
                    return;
                }

                res.status(200).send({message: "Upload verification file successfull", verified:true});
            });
        });
}

module.exports = {
    getAccommodationListForUser,
    getAccommodationById,
    addAccommodation,
    getAccommodationDetailById,
    getUserAccommodation,
    getAccommodation,
    updateAccommodation,
    uploadAccommodationVerificationDocument
};