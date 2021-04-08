const mongoose = require("mongoose");

const Country = mongoose.model(
    "Country",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        generalInformation: {
            type: String
        },
        housingInformation: {
            type: String
        },
        legalInformation: {
            type: String
        },
        culturalInformation: {
            type: String
        },
        banner_picture: {
            type: String
        },
        flag_picture: {
            type: String
        }
    })
);

module.exports = Country;