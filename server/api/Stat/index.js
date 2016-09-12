'use strict';

var express = require('express');
var controller = require('./Stat.controller');

var router = express.Router();

router.get('/topCheckinsForZip/:zip', controller.topCheckinsForZip);
router.get('/topUsersForZip/:zip', controller.topUsersForZip);
module.exports = router;
