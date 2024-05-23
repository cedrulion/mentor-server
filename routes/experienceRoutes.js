const express = require('express');
const router = express.Router();
const passport = require('passport');
const experienceController = require('../controllers/experienceController');

// Create a new experience
router.post('/experience', passport.authenticate('jwt', { session: false }), experienceController.createExperience);

// Get all experiences of a user
router.get('/experience/:id', passport.authenticate('jwt', { session: false }), experienceController.getUserExperiences);

// Get a single experience by ID
router.get('/experience/details/:id', passport.authenticate('jwt', { session: false }), experienceController.getExperienceById);

// Update an experience
router.put('/experience/:id', passport.authenticate('jwt', { session: false }), experienceController.updateExperience);

// Delete an experience
router.delete('/experience/:id', passport.authenticate('jwt', { session: false }), experienceController.deleteExperience);

module.exports = router;
