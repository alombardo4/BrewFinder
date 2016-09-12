'use strict';

var express = require('express');
var controller = require('./BreweryDBAPI.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();


router.post('/beer', controller.runBeerUpdate);
router.post('/brewery', controller.runBreweryUpdate);
router.get('/', auth.hasRole('admin'), controller.index);
router.get('/count', auth.hasRole('admin'), controller.count);

module.exports = router;
