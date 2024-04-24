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
router.get('/user/details', passport.authenticate('jwt', { session: false }), userDetailsController.getAllUserDetails);

module.exports = router;
