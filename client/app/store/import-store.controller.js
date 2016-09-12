'use strict';

angular.module('brewfinderwebApp')
  .controller('ImportStoreCtrl', function ($scope, stores, $stateParams, $location, follow, $mdToast, Auth, localities) {
    $scope.auth = Auth;
    localities.getLocalities().then(function(result) {
      $scope.localities = result.data;
    });

    $scope.searchPlaces = function(locality) {
      $scope.loading = true;
      $mdToast.show($mdToast.simple().textContent('Loading...'));
      stores.getPlacesStores(locality).then(function(result) {
        $scope.places = result.data;
        $scope.loading = false;
      });

    };

    $scope.save = function(store) {
      stores.createStore(store).then(function(result) {
        $mdToast.show($mdToast.simple().textContent('Created ' + result.data.name));
      });
    };
    $scope.importAll = function() {
      stores.bulkCreateStores($scope.places).then(function(result) {
        $mdToast.show($mdToast.simple().textContent('Imported All! - ' + result.data));
      });

    };
  });
