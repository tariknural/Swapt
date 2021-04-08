const {authJwt} = require("../middlewares");
const {pictureUploader} = require("../middlewares");
const {pdfUploader} = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    /**
     * Get active user based on token.
     */
    app.get("/api/user", [authJwt.verifyToken], controller.getUser);

    /**
     * Get user by id
     */
    app.get("/api/user/getById/:id", [authJwt.verifyToken], controller.getUserById);

    /**
     * Update user data
     */
    app.post("/api/user", [authJwt.verifyToken], controller.updateUser);

    /**
     * Update user data
     */
    app.post("/api/user/updatepassword", [authJwt.verifyToken], controller.updateUserPassword);

    /**
     * Update user image
     */
    app.post("/api/user/updatepicture", [authJwt.verifyToken, pictureUploader.single('profile_picture')], controller.updateUserPicture);

    /**
     * Upload user verification file
     */
    app.post("/api/user/uploadverification", [authJwt.verifyToken, pdfUploader.single('profile_verification')], controller.uploadUserVerificationDocument);

    /**
     * Get user premium status
     */
    app.get("/api/user/premiumstatus", [authJwt.verifyToken], controller.getUserPremiumStatus);

    /**
     * Set user role
     */
    app.post("/api/user/setrole/:role", [authJwt.verifyToken], controller.setUserRole);

    /**
     * Test routes for restricted area.
     */
    app.get("/api/test/all", controller.allAccess);
    app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);
    app.get(
        "/api/test/premiumUser",
        [authJwt.verifyToken, authJwt.ispremiumUser],
        controller.premiumUserBoard
    );

};