const mongoose = require("mongoose");
const db = require("../models");
const University = db.university;

/**
 * Function to get all universities for listing.
 * @param req
 * @param res
 */
const getAllUniversities = (req, res) => {
    University.find({}).exec()
        .then(university => {

            if (!university) return res.status(404).json({
                error: 'Not Found',
                message: `User not found`
            });

            res.status(200).json(university)

        })
        .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));
};

/**
 * Function to get country by id.
 * @param req
 * @param res
 */
const getUniversity = (req, res) => {
    University.findById(req.params.id).exec()
        .then(university => {

            if (!university) return res.status(404).json({
                error: 'Not Found',
                message: `User not found`
            });

            res.status(200).json(university)

        })
        .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));
};

/**
 * Function to get all universities by country id.
 * @param req
 * @param res
 */
const getAllUniversitiesByCountry = (req, res) => {
    University.find({
        country: mongoose.Types.ObjectId(req.params.id)
    }).exec()
        .then(university => {

            if (!university) return res.status(404).json({
                error: 'Not Found',
                message: `User not found`
            });

            res.status(200).json(university)

        })
        .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));
};

/**
 * Function to get all universities by city id.
 * @param req
 * @param res
 */
const getAllUniversitiesByCity = (req, res) => {
    University.find({
        city: mongoose.Types.ObjectId(req.params.id)
    }).exec()
        .then(university => {

            if (!university) return res.status(404).json({
                error: 'Not Found',
                message: `User not found`
            });

            res.status(200).json(university)

        })
        .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));
};

module.exports = {
    getAllUniversities,
    getUniversity,
    getAllUniversitiesByCountry,
    getAllUniversitiesByCity
};