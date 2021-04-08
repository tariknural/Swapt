const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        profile_picture: {
            type: String
        },
        home_university: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "University"
        },
        destination_university: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "University"
        },
        home_city: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "City"
        },
        destination_city: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "City"
        },
        exchange_date_start: {
            type: Date
        },
        exchange_date_end: {
            type: Date
        },
        verification_file: {
            type: String
        },
        is_verified_exchange_student:{
            type: Boolean,
        },
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "UserRole"
            }
        ]
    })
);

module.exports = User;