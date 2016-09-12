'use strict';

var express = require('express');
var controller = require('./Beer.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/byBrewery/:apiID', controller.getBeersForBrewery);
module.exports = router;
