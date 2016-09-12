'use strict';

angular.module('brewfinderwebApp')
  .controller('StoreCtrl', function ($scope, stores, $stateParams, $location, follow, $mdToast, Auth) {
    $scope.auth = Auth;

    $scope.init = function() {
      if ($stateParams.id) {
        $scope.mode = 'update';
        stores.getStore($stateParams.id).then(function(result) {
          $scope.store = result.data;
        });
      } else {
        $scope.mode = 'create';
        $scope.store = {};
        $scope.store.location = {};
      }
    };
    stores.getPlacesStores().then(function(result) {
      console.log(result);
    });
    $scope.save = function() {
      if ($scope.mode === 'update') {
        stores.updateStore($scope.store).then(function(result) {
          $location.path('/stores/' + result.data._id);
        });
      } else if ($scope.mode === 'create') {
        stores.createStore($scope.store).then(function(result) {
          $location.path('/stores/' + result.data._id);
        });
      }
    };
  });
