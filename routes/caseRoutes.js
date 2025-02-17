const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');

const passport = require('passport');

// Route to create a new case (clients only)
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  caseController.createCase
);

// Route to get all cases (filtered by user role)
router.get(
  '/',
 passport.authenticate('jwt', { session: false }),
  caseController.getAllCases
);

// Route to get a single case by ID
router.get(
  '/:id',
passport.authenticate('jwt', { session: false }),
  caseController.getCaseById
);

// Route to update a case
router.patch(
  '/:id',
passport.authenticate('jwt', { session: false }),
  caseController.updateCase
);

// Route to assign a lawyer to a case (admin or lawyer only)
router.post(
  '/assign',
passport.authenticate('jwt', { session: false }),
  caseController.assignLawyer
);

// Route to add a note to a case
router.post(
  '/note',
passport.authenticate('jwt', { session: false }),
  caseController.addNote
);

module.exports = router;