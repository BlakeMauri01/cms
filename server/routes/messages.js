var express = require('express');
var router = express.Router();
var sequenceGenerator = require('./sequenceGenerator');

const Message = require('../models/message');
const Contact = require('../models/contact');

function returnError(res, error) {
  res.status(500).json({
    Contactmessage: 'An error occured',
    error: error
  });
}
router.get('/', (req, res, next) => {
  Message.find()
    .populate('sender')
    .then(messages => {
      res.status(200).json({
        message: 'Messages fetched successfully!',
        messages: messages
      });
    })
    .catch(error => {
      returnError(res, error);
    });
});
