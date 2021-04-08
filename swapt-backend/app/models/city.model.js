const mongoose = require("mongoose");

const City = mongoose.model(
    "City",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        country: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Country",
            required: true
        },
        banner_picture: {
            type: String
        }
    })
);

module.exports = City;