const express = require('express');
const router = express.Router();
const passport = require('passport');
const chatController = require('../controllers/chatController');

// Route to send a message in a chat
router.post('/send', passport.authenticate('jwt', { session: false }), chatController.createMessage);

// Route to get a chat between mentor and client
router.get('/get', passport.authenticate('jwt', { session: false }), chatController.getChat);

module.exports = router;
