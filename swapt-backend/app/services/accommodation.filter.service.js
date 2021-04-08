const mongoose = require("mongoose");
const db = require("../models");
const {country, city} = require("../models");
const User = require("../models/user.model");
const Accommodation = db.accommodation;

function getUserDestinationCityAndCountry(req, res) {
    return User.findById(req.params.id)
        .populate({
            path: "destination_city",
            populate: {
                path: "country",
            },
        })
        .exec();
}

/**
 * @param {*} filterFields
 * get the filter fields and iterate in the accommodations list. only filter if input given. return accommodation object as output in result.
 */
function getAccommodationListForGivenFilter(req, res) {
    // user id generated from verifyToken
    User.findById(req.userId)
        .exec()
        .then((user) => {
            if (!user)
                return res.status(404).json({
                    error: "Not Found",
                    message: `User not found`,
                });

            let clearedFilters = clearFilters(req.body, user);

            console.log(clearedFilters);
            return Accommodation.aggregate()
                .lookup({
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                })
                .match(clearedFilters)
                .unwind("$user")
                .exec()
                .then((accommodations) => {
                    res.status(200).json(accommodations);
                })
                .catch((error) =>
                    res.status(500).json({
                        error: "Internal Server Error",
                        message: error.message,
                    })
                );
        })
        .catch((error) =>
            res.status(500).json({
                error: "Internal Server Error",
                message: error.message,
            })
        );
}

function clearFilters(filterFields, user) {

    let clearedFilters = {};

    if (
        !(
            filterFields.rent_per_month === undefined ||
            filterFields.rent_per_month === null ||
            filterFields.rent_per_month.length == 0
        )
    )
        clearedFilters["rent_per_month"] = {
            $lte: parseFloat(filterFields.rent_per_month),
        };

    if (
        !(
            filterFields.size === undefined ||
            filterFields.size == null ||
            filterFields.size == 0
        )
    )
        clearedFilters["size"] = {$lte: parseFloat(filterFields.size)};

    if (
        !(
            filterFields.zip_code === undefined ||
            filterFields.zip_code == null ||
            filterFields.zip_code == 0
        )
    )
        clearedFilters["zip_code"] = {$in: [filterFields.zip_code]};

    if (
        !(
            filterFields.street_name === undefined ||
            filterFields.street_name == null ||
            filterFields.street_name == 0
        )
    )
        clearedFilters["street"] = {
            $in: [filterFields.street_name],
        };

    if (
        !(
            filterFields.street_number === undefined ||
            filterFields.street_number == null ||
            filterFields.street_number == 0
        )
    )
        clearedFilters["street_number"] = {
            $in: [filterFields.street_number],
        };

    if (
        !(
            filterFields.verified_accommodation === undefined ||
            filterFields.verified_accommodation == null ||
            filterFields.verified_accommodation.length == 0
        )
    )
        clearedFilters["is_verified_by_landlord"] = {
            $eq: filterFields.verified_accommodation,
        };

    if (
        !(
            filterFields.verified_user === undefined ||
            filterFields.verified_user == null ||
            filterFields.verified_user.length == 0
        )
    )
        clearedFilters["user.is_verified_exchange_student"] = {
            $eq: filterFields.verified_user,
        };

    if (
        !(
            filterFields.to_my_city === undefined ||
            filterFields.to_my_city == null ||
            filterFields.to_my_city.length == 0
        )
    )
        clearedFilters["user.destination_city"] = {
            $eq: user.home_city,
        };

    // show accommodation from user destination city
    clearedFilters['city'] = mongoose.Types.ObjectId(
        user.destination_city
    );

    // between his/her exchange date +- 30 Days
    let startDate = new Date(user.exchange_date_start);
    startDate.setDate(startDate.getDate() - 30);

    let endDate = new Date(user.exchange_date_end);
    endDate.setDate(endDate.getDate() + 30);

    clearedFilters["user.exchange_date_start"] = {$gte: startDate};
    clearedFilters["user.exchange_date_end"] = {$lte: endDate};

    // and set active from the accommodation owner
    clearedFilters['is_active'] = true;

    return clearedFilters;
}

module.exports = {
    getAccommodationListForGivenFilter,
    getUserDestinationCityAndCountry,
};
