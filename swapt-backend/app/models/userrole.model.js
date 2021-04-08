const mongoose = require("mongoose");

const UserRole = mongoose.model(
    "UserRole",
    new mongoose.Schema({
        name: String
    })
);

module.exports = UserRole;