const {authJwt} = require("../middlewares");
const controller = require("../controllers/city.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    /**
     * Get all cities for listing
     */
    app.get("/api/city", [authJwt.verifyToken], controller.getAllCities);

    /**
     * Get city by id
     */
    app.get("/api/city/:id", [authJwt.verifyToken], controller.getCity);

    /**
     * Get cities by countryid
     */
    app.get("/api/city/bycountry/:id", [authJwt.verifyToken], controller.getAllCitiesByCountry);

};