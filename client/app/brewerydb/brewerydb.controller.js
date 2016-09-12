'use strict';

angular.module('brewfinderwebApp')
  .controller('BreweryDBCtrl', function ($scope, brewerydb) {

    $scope.init = function() {
      brewerydb.getBreweryDBUpdates().then(function(result) {
        $scope.updates = result.data;
      });
      brewerydb.getCount().then(function(result) {
        $scope.count = result.data;
      });
    };

  });
