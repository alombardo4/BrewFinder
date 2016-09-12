'use strict';

var express = require('express');
var controller = require('./Checkin.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.get('/', controller.index);
router.get('/nearby/:zip', controller.nearby);
router.get('/nearby/:zip/beer/:beer', controller.beerCheckins);
router.get('/store/:id', controller.storeCheckins);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.get('/byUser/:id', controller.byUser);
router.get('/byUser/me/show', auth.isAuthenticated(), controller.me);

module.exports = router;
