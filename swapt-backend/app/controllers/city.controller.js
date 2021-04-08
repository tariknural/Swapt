const mongoose = require("mongoose");
const db = require("../models");
const City = db.city;

/**
 * Function to get all cities for listing.
 * @param req
 * @param res
 */
const getAllCities = (req, res) => {
    City.find({}).exec()
        .then(city => {

            if (!city) return res.status(404).json({
                error: 'Not Found',
                message: `User not found`
            });

            res.status(200).json(city)

        })
        .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));
};

/**
 * Function to get city by id.
 * @param req
 * @param res
 */
const getCity = (req, res) => {
    City.findById(req.params.id).exec()
        .then(city => {

            if (!city) return res.status(404).json({
                error: 'Not Found',
                message: `User not found`
            });

            res.status(200).json(city)

        })
        .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));
};

/**
 * Function to get all cities by country id.
 * @param req
 * @param res
 */
const getAllCitiesByCountry = (req, res) => {
    City.find({
        country: mongoose.Types.ObjectId(req.params.id)
    }).exec()
        .then(city => {

            if (!city) return res.status(404).json({
                error: 'Not Found',
                message: `User not found`
            });

            res.status(200).json(city)

        })
        .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));
};

module.exports = {
    getAllCities,
    getCity,
    getAllCitiesByCountry
};