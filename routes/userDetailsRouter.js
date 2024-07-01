const express = require('express');
const router = express.Router();
const userDetailsController = require('../controllers/userDetailsController');
const passport = require('passport');

// Route for creating user details
router.post('/userdetail', passport.authenticate('jwt', { session: false }), userDetailsController.createUserDetail);

// Route for getting a specific user detail
router.get('/user/detail/:userId', passport.authenticate('jwt', { session: false }), userDetailsController.getUserDetail);
router.get('/getdetail', passport.authenticate('jwt', { session: false }), userDetailsController.getUserDetails);
// Route for getting all user details
router.get('/user/details', userDetailsController.getAllUserDetails);
router.get('/user/info', passport.authenticate('jwt', { session: false }), userDetailsController.getAllUser);
router.get('/view/:id', passport.authenticate('jwt', { session: false }), userDetailsController.getUserDetailById);
router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), userDetailsController.deleteUserDetail);
// Route to add review to a user
router.put('/mentors/:mentorId/review', passport.authenticate('jwt', { session: false }), userDetailsController.addReview);

module.exports = router;
