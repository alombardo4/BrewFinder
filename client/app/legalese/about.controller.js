'use strict';

angular.module('brewfinderwebApp')
  .controller('AboutCtrl', function ($scope, Auth) {
    if (Auth.isLoggedIn()) {
      $scope.user = Auth.getCurrentUser();
    }
  });
