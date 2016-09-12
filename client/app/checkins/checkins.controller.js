'use strict';

angular.module('brewfinderwebApp')
  .controller('CheckinsCtrl', function ($scope, $state, $stateParams, beer, stores, Search, location, checkins) {
    $scope.checkins = [];
    location.updateLocation();

    $scope.$watch('location.zip', function() {
      if (location.zip !== null) {
        checkins.getNearbyCheckins(location.getLocation()).then(function(results) {
          $scope.checkins = results.data;
        });
      }
    });
  });
