'use strict';

var Router = require('express');
var controller = require('./user.controller');
var auth = require('../../auth/auth.service');

var router = new Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.put('/:id/settings', auth.isAuthenticated(), controller.changeSettings);
router.get('/show/:id', controller.show);
router.post('/', controller.create);


module.exports = router;
