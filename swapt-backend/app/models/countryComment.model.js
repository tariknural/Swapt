const mongoose = require("mongoose");

let commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    time: {
        type: Date,
        required: true
    }    
});

commentSchema.add({
    answers: {
        type: [commentSchema],
    }
})

const Comment = mongoose.model("comment", commentSchema)

const CommentsOfCountry = mongoose.model(
    "CountryComment",
    new mongoose.Schema({
        countryId : {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        informationType: {
            type: String,
        },
        comments: {
            type: [commentSchema],
            required: true
        }
    })
);

module.exports = {CommentsOfCountry, Comment};