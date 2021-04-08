const {authJwt} = require("../middlewares");
const controller = require("../controllers/message.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    /**
     * Get all messages between 2 users from db
     */
    app.get("/api/message/getMessages/:param1/:param2", [authJwt.verifyToken], controller.getAllMessages);

    /**
     * Get all messages between the current user and all other users
     */
    app.get("/api/message/getUsers/:id", [authJwt.verifyToken], controller.getUsers);

    /**
     * Post new messages
     */
    app.post("/api/message/sendMessage", [authJwt.verifyToken], controller.sendMessage);
};