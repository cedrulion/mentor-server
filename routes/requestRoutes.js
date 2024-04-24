const express = require('express');
const router = express.Router();
const passport = require('passport');
const RequestController = require('../controllers/RequestController');

// Create request
router.post('/requests/:mentorId',  passport.authenticate('jwt', { session: false }), RequestController.createRequest);

// Get requests by user (mentor)
router.get('/requests',  passport.authenticate('jwt', { session: false }), RequestController.getRequestsByMentor);
router.get('/request/status',  passport.authenticate('jwt', { session: false }), RequestController.getRequestStatusForLearner);
// Endpoint to get request status for the logged-in learner
router.get('/request-status',  passport.authenticate('jwt', { session: false }), RequestController.getRequestStatusForLearnerr);
// Update request status
router.put('/requests/:requestId',  passport.authenticate('jwt', { session: false }), RequestController.updateRequestStatus);

module.exports = router;
