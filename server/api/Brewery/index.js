'use strict';

var express = require('express');
var controller = require('./Brewery.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/byApiID/:apiID', controller.findByApiID);
router.get('/byApiID/:apiID/withBeers', controller.findByApiIDWithBeers);

module.exports = router;
