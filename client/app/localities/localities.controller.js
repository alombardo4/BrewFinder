'use strict';

angular.module('brewfinderwebApp')
  .controller('LocalitiesCtrl', function ($scope, localities) {

    localities.getLocalities().then(function(result) {
      $scope.localities = result.data;
    });

    $scope.deleteLocality = function(locality) {
      localities.deleteLocality(locality).then(function() {
        localities.getLocalities().then(function(result) {
          $scope.localities = result.data;
        });
      });
    };

    $scope.addLocality = function(locality) {
      localities.createLocality(locality).then(function() {
        localities.getLocalities().then(function(result) {
          $scope.localities = result.data;
        });
      });
    };

  });
