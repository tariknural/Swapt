const config = require("../config/auth.config");
const mongoose = require("mongoose");
const db = require("../models");
const Message = db.message;

/**
 * Function to get all messages between two users in database
 */
const getAllMessages = (req, res) => {
    Message.find({toId: {$in: [req.params.param1, req.params.param2]}, fromId: {$in: [req.params.param1, req.params.param2]}}, (err, messages) => {
        res.send(messages);
    });
};


/**
 * Function to get all messages between the current user and all other users
 */
const getUsers = (req, res) => {
    Message.find({$or: [{fromId: req.params.id}, {toId: req.params.id}]}, (err, messages) => {
        res.send(messages);
    });
};

/**
 * Function to store a message in database
 */
const sendMessage = (req, res) => {
  Message.create(req.body)
      .then(message => {
          if (!message) return res.status(404).json({
              error: 'Not Found',
              message: `User not found`
          });
          res.status(200).json(message)
      })
      .catch(error => res.status(500).json({
          error: 'Internal Server Error',
          message: error.message
      }));
};

module.exports = {
    getAllMessages,
    getUsers,
    sendMessage
};