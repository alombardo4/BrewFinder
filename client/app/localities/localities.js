'use strict';

angular.module('brewfinderwebApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('localities', {
        url: '/localities',
        templateUrl: 'app/localities/localities.html',
        controller: 'LocalitiesCtrl',
        authenticate: 'admin'
      });
  });
