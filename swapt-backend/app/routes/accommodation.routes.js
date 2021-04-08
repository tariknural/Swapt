const {authJwt} = require("../middlewares");
const {pictureUploader} = require("../middlewares");
const {pdfUploader} = require("../middlewares");
const accommodationController = require("../controllers/accommodation.controller");
const accommodationFilterController = require("../controllers/accommodation.filter.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    /**
     * Get accommodation list for active user
     */
    app.get("/api/accommodation/foruser", [authJwt.verifyToken], accommodationController.getAccommodationListForUser);

    /**
     * Get active user accommodations
     */
    app.get("/api/accommodation/useraccommodation", [authJwt.verifyToken], accommodationController.getUserAccommodation);

    /**
     * Get accommodation of given user
     */
    app.get("/api/accommodation/user/:id", [authJwt.verifyToken], accommodationController.getAccommodation);

    /**
     * Get accommodation by id
     */
    app.get("/api/accommodation/:id", [authJwt.verifyToken], accommodationController.getAccommodationById);

    /**
     * Create new accommodation
     */
    app.post("/api/accommodation/add", [authJwt.verifyToken, pictureUploader.array('accommodation_pictures',5)], accommodationController.addAccommodation);

        /**
     * Get accommodation details by its id
     */
    app.get("/api/accommodation/detail/:id",  [authJwt.verifyToken], accommodationController.getAccommodationDetailById);
    
    /**
     * Filter accommodation for given parameters
     */
    app.post("/api/accommodation/filter", [authJwt.verifyToken], accommodationFilterController.getAccommodationListForGivenFilter);

    app.get("/api/accommodation/filter/user/destination/cc/:id",  [authJwt.verifyToken], accommodationFilterController.getUserDestinationCityAndCountry);

    /**
     * Update accommodation data
     */
    app.post("/api/accommodation/update", [authJwt.verifyToken, pictureUploader.array('accommodation_pictures',5)], accommodationController.updateAccommodation);

    /**
     * Upload user verification file
     */
    app.post("/api/accommodation/uploadverification", [authJwt.verifyToken, pdfUploader.single('accommodation_verification')], accommodationController.uploadAccommodationVerificationDocument);


};