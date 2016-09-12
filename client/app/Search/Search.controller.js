'use strict';

angular.module('brewfinderwebApp')
  .controller('SearchCtrl', function ($scope, $stateParams, Search) {
    Search.setMode($stateParams.mode);
    Search.setQuery($stateParams.query);
    Search.setZip($stateParams.zip);
    $scope.count = 0;
    $scope.init = function() {
      $scope.mode = Search.getMode();
      $scope.query = Search.getQuery();
      $scope.zip = Search.getZip();
      if ($scope.mode === 'beer') {
        Search.searchBeers($scope.query).then(function(result) {
          $scope.beers = result.data;
          $scope.count = $scope.beers.length;
        });
      } else if ($scope.mode === 'brewery') {
        Search.searchBreweries($scope.query).then(function(result) {
          $scope.breweries = result.data;
          $scope.count = $scope.breweries.length;
        });
      } else if ($scope.mode === 'store') {
        Search.searchStores($scope.query, $scope.zip).then(function(result) {
          $scope.stores = result.data;
          $scope.count = $scope.stores.length;
        });
      }
    };
    $scope.init();



  });
