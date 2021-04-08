const mongoose = require("mongoose");
const db = require("../models");
const { country, city } = require("../models");
const User = require("../models/user.model");
const { populate } = require("../models/user.model");
const Accommodation = db.accommodation;

function getAccommodationDetailById(id) {
  return Accommodation.findById(id)
    .populate({
      path: "country",
    })
    .populate({
      path: "city",
    })
    .populate({
      path: "user",
      populate: {
        path: "destination_city",
      },
    }).populate({
        path:"user",
        populate: {
            path: "home_city",
        }
    }).populate({
        path:"user",
        populate:{
            path: "home_university"
        }
    }).populate({
        path:"user",
        populate:{
            path:"destination_university"
        }
    })
    .exec();
}

module.exports = {
  getAccommodationDetailById,
};
