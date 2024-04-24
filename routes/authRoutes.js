const express = require('express');
const router = express.Router();
const { signUp, signIn, logOut } = require('../controllers/AuthController');

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/logout/:id', logOut);

module.exports = router;
