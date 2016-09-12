'use strict';

angular.module('brewfinderwebApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('me', {
        url: '/me',
        templateUrl: 'app/user/user.html',
        controller: 'UserCtrl',
        authenticate: true
      })
      .state('user', {
        url: '/users/:id',
        templateUrl: 'app/user/user.html',
        controller: 'UserCtrl'
      });
  });
