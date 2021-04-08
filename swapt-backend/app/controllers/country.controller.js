const db = require("../models");
const Country = db.country;

/**
 * Function to get all countries for listing.
 * @param req
 * @param res
 */
const getAllCountries = (req, res) => {
    Country.find({})
        .select("-generalInformation")
        .select("-housingInformation")
        .select("-legalInformation")
        .select("-culturalInformation")
        .select("-banner_picture")
        .exec()
        .then(country => {

            if (!country) return res.status(404).json({
                error: 'Not Found',
                message: `No country in the database`
            });

            res.status(200).json(country)

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
const getCountry = (req, res) => {
    Country.findById(req.params.id).exec()
        .then(country => {

            if (!country) return res.status(404).json({
                error: 'Not Found',
                message: `Country not found`
            });

            res.status(200).json(country)

        })
        .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));
};


module.exports = {
    getAllCountries,
    getCountry
};