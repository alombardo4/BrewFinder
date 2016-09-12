'use strict';

angular.module('brewfinderwebApp')
  .controller('MainCtrl', function ($scope, location, checkins, stats) {

    function updateLists(zip) {
      $scope.loadingRecentCheckins = true;
      checkins.getNearbyCheckins(zip).then(function(result) {
        $scope.checkins = result.data;
        $scope.loadingRecentCheckins = false;
      });
      $scope.loadingTopLocal = true;
      stats.getTopLocalBeers(zip).then(function(result) {
        $scope.topLocalBeers = result.data;
        $scope.loadingTopLocal = false;
      });
      $scope.loadingTopUsers = true;
      stats.getTopLocalUsers(zip).then(function(result) {
        $scope.topLocalUsers = result.data;
        $scope.loadingTopUsers = false;
      });
    }

    $scope.zip = location.updateLocation();


    $scope.$watch('location.zip', function() {
      if (location.zip !== null) {
        $scope.zip = location.getLocation();
        updateLists($scope.zip);
      }
    });

    $scope.saveZip = function(zip) {
      location.zip = zip;
      $scope.zip = zip;
      updateLists(zip);
    };
  });
