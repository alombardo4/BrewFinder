'use strict';

angular.module('brewfinderwebApp')
  .controller('StoresCtrl', function ($scope, stores, $stateParams, Auth, checkins, follow, $mdToast) {
    $scope.auth = Auth;
    stores.getStore($stateParams.id).then(function(result) {
      $scope.store = result.data;
    });
    checkins.getStoreCheckins($stateParams.id).then(function(result) {
      $scope.checkins = result.data;
    });

    $scope.createFollow = function() {
      follow.createStoreFollow($scope.store).then(function(result) {
        if (result.status === 200 || result.status === 201) {
          $mdToast.show($mdToast.simple().textContent('Followed!'));
        } else {
          $mdToast.show($mdToast.simple().textContent('An error occurred!'));
        }
      });
    };

  });
