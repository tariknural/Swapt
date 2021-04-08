const mongoose = require("mongoose");

const Message = mongoose.model(
    "Message",
    new mongoose.Schema({
        fromId: {
            type: String,
            required: true
        },
        fromName: {
            type: String,
            required: true
        },
        toId: {
            type: String,
            required: true
        },
        toName: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        }
    })
);

module.exports = Message;