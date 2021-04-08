const db = require("../models");
const fs = require('fs');
const accommodationsData = require( '../../dump/swapt/accommodations.json' );
const countriesData = require( '../../dump/swapt/countries.json' );
const citiesData = require( '../../dump/swapt/cities.json' );
const countrycommentsData = require( '../../dump/swapt/countrycomments.json' );
const universitiesData = require( '../../dump/swapt/universities.json' );
const userrolesData = require( '../../dump/swapt/userroles.json' );
const usersData = require( '../../dump/swapt/users.json' );

// Init UserRole Collection
const dbConfig = require("../config/db.config");

function initStart() {
    db.mongoose
        .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("Successfully connect to MongoDB.");
            // Init dummy data
            basicDatabaseDataInit();
        })
        .catch((err) => {
            console.error("Connection error", err);
            process.exit();
        });
}

// MongoDB connection

const UserRole = db.userrole;
const City = db.city;
const Country = db.country;
const University = db.university;
const User = db.user;
const Accommodation = db.accommodation;
const CommentsOfCountry = db.commentsOfCountry;

/**
 * Init basic database data.
 * This will only be triggered if the database is empty.
 * To generate the dummy data, delete all collections in your mongoDB database.
 */
function basicDatabaseDataInit() {
    // init country
    Country.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            Country.insertMany(countriesData);
            console.log("Country Data Initialized");
        }
    });

    // init country comment
    CommentsOfCountry.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            CommentsOfCountry.insertMany(countrycommentsData);
            console.log("CommentsOfCountry Data Initialized");
        }
    });

    // init cities
    City.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            City.insertMany(citiesData);
            console.log("City Data Initialized");
        }
    });

    // init accommodation
    Accommodation.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            Accommodation.insertMany(accommodationsData);
            console.log("Accommodation Data Initialized");
        }
    });

    // init universities
    University.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            University.insertMany(universitiesData);
            console.log("University Data Initialized");
        }
    });

    // init userrole
    UserRole.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            UserRole.insertMany(userrolesData);
            console.log("UserRole Data Initialized");
        }
    });

    // init user
    User.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            User.insertMany(usersData);
            console.log("User Data Initialized");
        }
    });
}

module.exports = {
    initStart: initStart,
};
