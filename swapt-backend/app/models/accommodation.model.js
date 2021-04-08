const mongoose = require("mongoose");

const Accommodation = mongoose.model(
    "Accommodation",
    new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        street: {
            type: String,
            required: true,
        },
        street_number: {
            type: String,
            required: true,
        },
        zip_code: {
            type: String,
            required: true,
        },
        city: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "City"
        },
        country: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Country"
        },
        additional_information: {
            type: String,
        },
        size: {
            type: Number,
            required: true,
        },
        accommodation_description :{
            type: String,
            required: true
        },
        pictures: [
            {
                type: String
            }
        ],
        verification_file: {
            type: String
        },
        is_verified_by_landlord: {
            type: Boolean
        },
        google_map : {
            type: Object
        },
        rent_per_month: {
            type: Number,
            required: true,
        },
        // to show accommodation in listing or not
        is_active: {
            type: Boolean
        }
    })
);

module.exports = Accommodation;