const express = require('express')
const router = express.Router();
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const WedGround = require('../models/wedGround');
const { isLoggedIn, isAuthor } = require('../middleware');
const wedGround = require('../controllers/wedGround');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(wedGround.index))
    .post(isLoggedIn, upload.array('image'), catchAsync(wedGround.createWedGround));

router.get('/new', isLoggedIn, catchAsync(wedGround.renderNewForm))

router.route('/:id')
    .get(catchAsync(wedGround.showWedGround))
    .put(isLoggedIn, isAuthor, upload.array('image'), catchAsync(wedGround.updateWedGround))
    .delete(isLoggedIn, isAuthor, catchAsync(wedGround.deleteWedGround))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(wedGround.renderEditForm));



module.exports = router;
