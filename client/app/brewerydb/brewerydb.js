'use strict';

angular.module('brewfinderwebApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('listUpdates', {
        url: '/brewerydb',
        templateUrl: 'app/brewerydb/brewerydb.html',
        controller: 'BreweryDBCtrl',
        authenticate: 'admin'
      });
  });
