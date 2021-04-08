const accommodationFilterService = require("../services/accommodation.filter.service");
const accommodationUtil = require("../util/accommodation.util");

const getAccommodationListForGivenFilter = (req, res) => {
    accommodationFilterService.getAccommodationListForGivenFilter(req,res);
};


const getUserDestinationCityAndCountry = (req,res) => {
    accommodationFilterService.getUserDestinationCityAndCountry(req,res)
    .then((user) => {
        if (!user)
          return res.status(404).json({
            error: "Not Found",
            message: `User not found`,
          });
        res.status(200).json(user);
      }).catch((error) =>
        res.status(500).json({
          error: "Internal Server Error",
          message: error.message,
        })
      );
}


module.exports = {
    getAccommodationListForGivenFilter,
    getUserDestinationCityAndCountry
}