const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const UserRole = db.userrole;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({message: "No token provided!"});
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({message: "Unauthorized!"});
        }

        // embedded user id after token verified to retrieve user.
        req.userId = decoded.id;
        next();
    });
};

ispremiumUser = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }

        UserRole.find(
            {
                _id: {$in: user.roles}
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({message: err});
                    return;
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "premiumUser") {
                        next();
                        return;
                    }
                }

                res.status(403).send({message: "Require premiumUser Role!"});
                return;
            }
        );
    });
};

const authJwt = {
    verifyToken,
    ispremiumUser
};
module.exports = authJwt;