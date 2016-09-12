'use strict';

angular.module('brewfinderwebApp')
  .controller('BeerCtrl', function ($scope, $stateParams, beer, checkins, location, Auth, follow, $mdToast) {
    $scope.auth = Auth;
    beer.getBeer($stateParams.id).then(function(result) {
      $scope.beer = result.data;
    });
    if (location.zip) {
      checkins.getBeerCheckins($stateParams.id, location.getLocation()).then(function(results) {
        $scope.checkins = results.data;
      });
    } else {
      location.updateLocation();
    }

    $scope.createFollow = function() {
      follow.createBeerFollow($scope.beer).then(function(result) {
        if (result.status === 200 || result.status === 201) {
          $mdToast.show($mdToast.simple().textContent('Followed!'));
        } else {
          $mdToast.show($mdToast.simple().textContent('An error occurred!'));
        }
      });
    };

    $scope.$watch('location.zip', function() {
      if (location.zip !== null) {
        checkins.getBeerCheckins($stateParams.id, location.getLocation()).then(function(results) {
          $scope.checkins = results.data;
        });
      }
    });
  });
