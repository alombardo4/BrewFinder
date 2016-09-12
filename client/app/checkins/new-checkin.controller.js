'use strict';

angular.module('brewfinderwebApp')
  .controller('NewCheckinCtrl', function ($scope, $stateParams, beer, stores, Search, location, checkins, $location) {
    $scope.checkin = {};
    $scope.init = function() {
      location.updateLocation();
      if ($stateParams.beer) {
        beer.getBeer($stateParams.beer).then(function(result) {
          $scope.checkin.beer = result.data;
        });
      }
      if ($stateParams.store) {
        stores.getStore($stateParams.store).then(function(result) {
          $scope.checkin.store = result.data;
        });
      }
    };

    $scope.getBeers = function(searchTerm) {
      return Search.searchBeers(searchTerm).then(function(result) {
        return result.data;
      });

    };

    $scope.getStores = function(searchTerm) {
      return Search.searchStores(searchTerm, location.getLocation()).then(function(result) {
          return result.data;
      }).catch(function() {
        //do nothing
      });
    };

    $scope.saveCheckin = function() {
      checkins.createCheckin($scope.checkin)
        .then(function(result) {
          $location.path('/checkins/' + result.data._id);
        })
        .catch(function() {
          $scope.error = 'Please enter all information to create a checkin.';
        });
    };
  });
