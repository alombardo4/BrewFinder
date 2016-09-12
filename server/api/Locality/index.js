'use strict';

var express = require('express');
var controller = require('./Locality.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/', auth.hasRole('admin'), controller.create);
router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.delete);
module.exports = router;
