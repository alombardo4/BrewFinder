'use strict';

angular.module('brewfinderwebApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('newCheckin', {
        url: '/checkin/new?beer&store',
        templateUrl: 'app/checkins/new-checkin.html',
        controller: 'NewCheckinCtrl',
        authenticate: true
      })
      .state('checkin', {
        url: '/checkins/:id',
        templateUrl: 'app/checkins/checkin.html',
        controller: 'CheckinCtrl'
      })
      .state('nearbyCheckins', {
        url: '/checkins',
        templateUrl: 'app/checkins/checkins.html',
        controller: 'CheckinsCtrl'
      });
  });
