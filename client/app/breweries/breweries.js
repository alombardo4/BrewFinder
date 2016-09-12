'use strict';

angular.module('brewfinderwebApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('breweries', {
        url: '/breweries/:id',
        templateUrl: 'app/breweries/breweries.html',
        controller: 'BreweriesCtrl'
      });
  });
