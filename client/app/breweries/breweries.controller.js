'use strict';

angular.module('brewfinderwebApp')
  .controller('BreweriesCtrl', function ($scope, breweries, $stateParams, beer, Auth, $mdToast, follow) {
    $scope.auth = Auth;
    breweries.getBrewery($stateParams.id).then(function(result) {
      $scope.brewery = result.data;
      beer.getBeersByBrewery($scope.brewery.apiID).then(function(result) {
        $scope.brewery.beers = result.data;
      });
    });
    $scope.createFollow = function() {
      var brewery = angular.copy($scope.brewery);
      brewery.checkins = null;
      brewery.beers = null;
      brewery.locations = null;
      follow.createBreweryFollow(brewery).then(function(result) {
        if (result.status === 200 || result.status === 201) {
          $mdToast.show($mdToast.simple().textContent('Followed!'));
        } else {
          $mdToast.show($mdToast.simple().textContent('An error occurred!'));
        }
      });
    };

  });
