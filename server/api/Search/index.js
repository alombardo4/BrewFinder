'use strict';

var express = require('express');
var controller = require('./Search.controller');

var router = express.Router();

router.get('/beer/:term', controller.searchBeer);
router.get('/brewery/:term', controller.searchBrewery);
router.get('/store/:term/:zip', controller.searchStore);
router.get('/chain/:term', controller.searchChain);


module.exports = router;
