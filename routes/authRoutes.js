const express = require('express');
const router = express.Router();
const passport = require('passport');
const { signUp, signIn, logOut, getAllUsers, getProfile, updateProfile,getLegalCounselors } = require('../controllers/AuthController');

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/logout/:id', logOut);
// Routes requiring authentication
router.get('/users', getAllUsers);
router.get('/profile',    passport.authenticate('jwt', { session: false }), getProfile);
router.put('/profile',    passport.authenticate('jwt', { session: false }), updateProfile);
router.get('/legal-counselors',  getLegalCounselors);


module.exports = router;
