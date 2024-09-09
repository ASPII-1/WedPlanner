const express = require('express')
const router = express.Router({ mergeParams: true });
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const WedGround = require('../models/wedGround');
const { isLoggedIn, isReviewAuthor } = require('../middleware');
const review = require('../controllers/review');


router.post('/', isLoggedIn, catchAsync(review.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(review.deleteReview));

module.exports = router;