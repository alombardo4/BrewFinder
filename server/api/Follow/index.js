'use strict';

var express = require('express');
var controller = require('./Follow.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/my', auth.isAuthenticated(), controller.my);
router.get('/:id', controller.show);
router.get('/user/:id', controller.forUser);
router.post('/', auth.isAuthenticated(), controller.create);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
