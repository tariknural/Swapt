const mongoose = require("mongoose");

const University = mongoose.model(
    "University",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        web_pages: [{
            type: String
        }],
        domains: [{
            type: String,
            required: true
        }],
        city: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "City"
        },
        country: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Country"
        }
    })
);

module.exports = University;