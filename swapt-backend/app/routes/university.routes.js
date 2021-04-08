const {authJwt} = require("../middlewares");
const controller = require("../controllers/university.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    /**
     * Get all universities for listing
     */
    app.get("/api/university", [authJwt.verifyToken], controller.getAllUniversities);

    /**
     * Get university by id
     */
    app.get("/api/university/:id", [authJwt.verifyToken], controller.getUniversity);

    /**
     * Get university by countryId
     */
    app.get("/api/university/bycountry/:id", [authJwt.verifyToken], controller.getAllUniversitiesByCountry);

    /**
     * Get university by cityId
     */
    app.get("/api/university/bycity/:id", [authJwt.verifyToken], controller.getAllUniversitiesByCity);

};