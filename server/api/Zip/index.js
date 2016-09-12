'use strict';

var express = require('express');
var controller = require('./Zip.controller');

var router = express.Router();

router.get('/:zip', controller.getZipInfo);
router.get('/:zip/withinDistance/:distance', controller.zipsWithinDistance);


module.exports = router;
