const express = require('express');
const router = express.Router();
const passport = require('passport');
const skillController = require('../controllers/skillController');

// Create a new experience
router.post('/skill', passport.authenticate('jwt', { session: false }), skillController.createSkill);

// Get all experiences of a user
router.get('/skill/:id', passport.authenticate('jwt', { session: false }), skillController.getUserSkills);

// Get a single experience by ID
router.get('/skill/details/:id', passport.authenticate('jwt', { session: false }), skillController.getSkillById);

// Update an experience
router.put('/skill/:id', passport.authenticate('jwt', { session: false }), skillController.updateSkill);

// Delete an experience
router.delete('/skill/:id', passport.authenticate('jwt', { session: false }), skillController.deleteSkill);

module.exports = router;
