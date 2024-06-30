const express = require('express');
const router = express.Router();
const passport = require('passport');
const chatController = require('../controllers/chatController');

// Client Routes
router.post('/chat/send', passport.authenticate('jwt', { session: false }), chatController.createMessage);
router.get('/chat/get/:mentorId', passport.authenticate('jwt', { session: false }), chatController.getChat);
router.get('/chat/client', passport.authenticate('jwt', { session: false }), chatController.getChatsForClient);

// Mentor Routes
router.post('/chat/mentor/reply', passport.authenticate('jwt', { session: false }), chatController.replyMessage);
router.get('/chat/mentor', passport.authenticate('jwt', { session: false }), chatController.getChatsForMentor);
router.get('/chat/mentors', passport.authenticate('jwt', { session: false }), chatController.getChats);

module.exports = router;
