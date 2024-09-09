const express = require('express')
const router = express.Router();
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const WedGround = require('../models/wedGround');
const feature = require('../controllers/feature');


router.get('/', catchAsync(feature.renderFeature));

router.get('/rated', catchAsync(feature.renderRated));

router.get('/expensive', catchAsync(feature.renderExpensive));

router.get('/economical', catchAsync(feature.renderEconomical));

router.get('/viewed', catchAsync(feature.renderViewed));

router.get('/newest', catchAsync(feature.renderNewest));

router.get('/oldest', catchAsync(feature.renderOldest));



module.exports = router;