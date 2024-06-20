const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const {
  createResource,
  getResourceById,
  updateResourceById,
  deleteResourceById,
  getResources,
  getVideo,
  getArticle,
  getWebinar,
  getModule,
} = require('../controllers/resourceController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const fileExt = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + fileExt);
  },
});

const upload = multer({ storage: storage });

router.post('/resources', passport.authenticate('jwt', { session: false }), upload.single('file'), createResource);
router.get('/resources/:id', passport.authenticate('jwt', { session: false }), getResourceById);
router.put('/resources/:id', passport.authenticate('jwt', { session: false }), updateResourceById);
router.delete('/resources/:id', passport.authenticate('jwt', { session: false }), deleteResourceById);
router.get('/resources', getResources);

// New routes for getting specific types of resources
router.get('/resources/video/:id', passport.authenticate('jwt', { session: false }), getVideo);
router.get('/resources/article/:id', passport.authenticate('jwt', { session: false }), getArticle);
router.get('/resources/webinar/:id', passport.authenticate('jwt', { session: false }), getWebinar);
router.get('/resources/module/:id', passport.authenticate('jwt', { session: false }), getModule);

module.exports = router;
