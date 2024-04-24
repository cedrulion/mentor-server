const express = require('express');
const router = express.Router();
const passport = require('passport');
const UserController = require('../controllers/UserController');

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'administrator') {
    return next();
  }
  res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
};

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.status(200).json({ message: 'Current user fetched successfully', data: { user: req.user } });
});

router.get('/allusers/:id', passport.authenticate('jwt', { session: false }), UserController.getAllUser);
router.get('/:userId', passport.authenticate('jwt', { session: false }), UserController.getUserById);
router.put('/:userId/profile', passport.authenticate('jwt', { session: false }), UserController.updateProfile);
router.delete('/:userId', passport.authenticate('jwt', { session: false }), isAdmin, UserController.deleteUser);
router.get('/', passport.authenticate('jwt', { session: false }), isAdmin, UserController.getAllUsers);

module.exports = router;
