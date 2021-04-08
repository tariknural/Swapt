const {authJwt} = require("../middlewares");
const controller = require("../controllers/countryComment.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    /**
     * Get all comments for country
     */
    app.get("/api/comment/:countryId", controller.getAllCommentsOfCountry);

    /**
     * Create new comment
     */
    app.post("/api/comment", [authJwt.verifyToken], controller.createComment);

};