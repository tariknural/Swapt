const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.userrole = require("./userrole.model");
db.city = require("./city.model");
db.country = require("./country.model");
db.university = require("./university.model");
db.accommodation = require("./accommodation.model");
db.message = require("./message.model");
var countryComments = require("./countryComment.model");
db.commentsOfCountry = countryComments.CommentsOfCountry;
db.comment = countryComments.Comment;

db.ROLES = ["user", "premiumUser"];

module.exports = db;