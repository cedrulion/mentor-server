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
// Route for getting a specific question by ID
router.get('/:questionId', passport.authenticate('jwt', { session: false }), questionController.getQuestionById);

// Route for getting all questions
router.get('/', passport.authenticate('jwt', { session: false }), questionController.getAllQuestions);

// Route for getting a specific comment on a question by ID
router.get('/:questionId/comments/:commentId', passport.authenticate('jwt', { session: false }), questionController.getCommentById);

// Route for getting all comments on a question
router.get('/:questionId/comments', passport.authenticate('jwt', { session: false }), questionController.getAllCommentsForQuestion);
// Route for learners to ask general questions
router.post('/ask/general', passport.authenticate('jwt', { session: false }), questionController.askQuestion);
// Route for learners to comment on a question
router.put('/comment/:questionId', passport.authenticate('jwt', { session: false }), questionController.commentOnQuestion);

module.exports = router;
