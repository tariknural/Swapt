const {authJwt} = require("../middlewares");
const controller = require("../controllers/country.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    /**
     * Get all countries for listing
     */
    app.get("/api/country", [authJwt.verifyToken], controller.getAllCountries);

    /**
     * Get country by id
     */
    app.get("/api/country/:id", [authJwt.verifyToken], controller.getCountry);

};