const express = require('express');
const router = express.Router();
const passport = require('passport');
const questionController = require('../controllers/questionController');

// Route for learners to ask questions to their mentors
router.post('/ask', passport.authenticate('jwt', { session: false }), questionController.askQuestionToMentor);

// Route for mentors and learners (with role 'learner') to view questions
router.get('/view', passport.authenticate('jwt', { session: false }), questionController.getQuestions);

// Route for users to upvote a question
router.put('/upvote/:questionId', passport.authenticate('jwt', { session: false }), questionController.upvoteQuestion);

// Route for users to downvote a question
router.put('/downvote/:questionId', passport.authenticate('jwt', { session: false }), questionController.downvoteQuestion);

router.put('/reply/:questionId', passport.authenticate('jwt', { session: false }), questionController.replyToQuestion);
router.delete('/questions/:questionId/replies/:replyId' , passport.authenticate('jwt', { session: false }), questionController.deleteReply);
module.exports = router;
