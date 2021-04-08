const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const UserRole = db.userrole;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    const user = new User({
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        profile_picture: "//ssl.gstatic.com/accounts/ui/avatar_2x.png",
        password: bcrypt.hashSync(req.body.password, 8)
    });

    user.save((err, user) => {
        if (err) {
            res.status(500).send({message: err.errmsg});
            return;
        }

        if (req.body.roles) {
            UserRole.find(
                {
                    name: {$in: req.body.roles}
                },
                (err, roles) => {
                    if (err) {
                        res.status(500).send({message: err.errmsg});
                        return;
                    }

                    user.roles = roles.map(role => role._id);
                    user.save(err => {
                        if (err) {
                            res.status(500).send({message: err.errmsg});
                            return;
                        }

                        res.send({message: "User was registered successfully!"});
                    });
                }
            );
        } else {
            UserRole.findOne({name: "user"}, (err, role) => {
                if (err) {
                    res.status(500).send({message: err.errmsg});
                    return;
                }

                user.roles = [role._id];
                user.save(err => {
                    if (err) {
                        res.status(500).send({message: err.errmsg});
                        return;
                    }

                    res.send({message: "User was registered successfully!"});
                });
            });
        }
    });
};

exports.login = (req, res) => {
    User.findOne({
        email: req.body.email
    })
        .populate("home_university", "-__v")
        .populate("destination_university", "-__v")
        .populate("home_city", "-__v")
        .populate("destination_city", "-__v")
        .populate("roles", "-__v")
        .select('+password')
        .exec((err, user) => {
            if (err) {
                res.status(500).send({message: err.errmsg});
                return;
            }

            if (!user) {
                return res.status(404).send({message: "User Not found."});
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            var token = jwt.sign({id: user.id}, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            var authorities = [];

            for (let i = 0; i < user.roles.length; i++) {
                authorities.push(user.roles[i].name.toUpperCase());
            }

            // TODO find way to remove user password before send the data to frontend
            user = cleanUpUserData(user);

            // User object passed so frontend can display data.
            // Backend need to reverify user and don't trust data from frontend as it can be manipulated.
            // Backend need to retrieve user data from authJwt verify token.
            res.status(200).send({
                activeUser: user,
                accessToken: token
            });
        });
};

const cleanUpUserData = (userData) => {
    // TODO :
    // with setting _id to undefined, frontend will get a random _id and not the real user._id for security reason 
    
    // userData._id = undefined;
    userData.__v = undefined;
    userData.password = undefined;
    return userData;
}