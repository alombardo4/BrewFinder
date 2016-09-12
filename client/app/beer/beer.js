'use strict';

angular.module('brewfinderwebApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('beer', {
        url: '/beers/:id',
        templateUrl: 'app/beer/beer.html',
        controller: 'BeerCtrl'
      });
  });
