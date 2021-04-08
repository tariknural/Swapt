const db = require("../models");
const jwt_decode = require('jwt-decode');
const CommentsOfCountry = db.commentsOfCountry;
const Country = db.country;
const Comment = db.comment;
const User = db.user;

/**
 * Function to get all countryComments.
 * The sorting looks like this:
 * @param req
 * @param res
 */
const getAllCommentsOfCountry = (req, res) => {
    CommentsOfCountry.where({countryId: req.params.countryId}).exec()
        .then(async commentsOfCountry => {
            if (!commentsOfCountry) return res.status(404).json({
                error: 'Not Found',
                message: `No comments for this country in the database`
            });
            for (let i = 0; i < commentsOfCountry.length; i++){
                commentsOfCountry[i] = commentsOfCountry[i].toObject();
                await addUsernameAndProfilePictureToComments(commentsOfCountry[i].comments)
            }

            responseObject = {};
            commentsOfCountry.forEach(commentsOfCountryForInformationType => {
                responseObject[commentsOfCountryForInformationType.informationType] = commentsOfCountryForInformationType;
            })
            res.status(200).json(responseObject)

        })
        .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));
};

/**
 * Creates a new comment and inserts it in the CommentsOfCountry Object. If the CommentsOfCountry Object does
 * not exist yet, it is created.
 * @param req
 * @param res
 */
const createComment = (req, res) => {
    Country.findById(req.body.countryId)
    .exec()
    .then(country =>{
        if (!country) return res.status(404).json({
            error: 'Not Found',
            message: `The country for this comment section does not exist`
        });
        CommentsOfCountry.where({countryId: req.body.countryId, informationType: req.body.informationType})
        .exec()
        .then(commentsOfCountry => {
            let newComment = new Comment({
                comment: req.body.comment,
                answers: [
                ],
                user: jwt_decode(req.headers["x-access-token"]).id,
                time: new Date()
            });

            if (commentsOfCountry.length === 0) {
                new CommentsOfCountry({
                    countryId: req.body.countryId,
                    informationType: req.body.informationType,
                    comments: [newComment
                    ]
                }).save(async (err, doc) => {
                    if (err) {
                        return res.status(404).json({
                            error: 'Not saved',
                            message: `Comment in ${req.body.informationType} could not be created`
                        });
                    }
                    let object = doc.toObject();
                    await addUsernameAndProfilePictureToComments(object.comments);
                    return res.status(200).json(object);
                });
            }
            else {
                let comments = commentsOfCountry[0].comments;
                insertComment(comments, newComment, req.body.predecessors);

                commentsOfCountry[0].save(async (err, doc) => {
                    if (err) {
                        return res.status(404).json({
                            error: 'Not saved',
                            message: `Comment in ${req.body.informationType} could not be created`
                        });
                    }
                    let object = doc.toObject();
                    await addUsernameAndProfilePictureToComments(object.comments);
                    return res.status(200).json(object); 
                })
            }
        })
        .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));
    })
};

const insertComment = (comments, comment, predecessors) => {
    if (predecessors[0] && predecessors.length > 0){
        for (let i = 0; i < comments.length; i++){
            if (comments[i].id === predecessors[0]) {
                predecessors.shift();
                insertComment(comments[i].answers, comment, predecessors);
                break;
            }
        }
    }
    else {
        comments.push(comment);
    }
}

const addUsernameAndProfilePictureToComments = async (comments, userCache = {}) => {
    for (let i = 0; i < comments.length; i++) {
        if (userCache[comments[i].user]){
            comments[i].userName = userCache[comments[i].user].userName;
            comments[i].profilePicture = userCache[comments[i].user].profilePicture;
        }
        else {
            let user = await User.findById(comments[i].user).exec();
            userCache[comments[i].user] =  {
                userName: user.first_name + " " + user.last_name,
                profilePicture: user.profile_picture
            }   
            comments[i].userName = user.first_name + " " + user.last_name;
            comments[i].profilePicture = user.profile_picture;
        }
        await addUsernameAndProfilePictureToComments(comments[i].answers, userCache);
    }
}


module.exports = {
    getAllCommentsOfCountry,
    createComment
};