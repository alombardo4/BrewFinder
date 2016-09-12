'use strict';

angular.module('brewfinderwebApp')
  .controller('DonateCtrl', function ($scope, Auth) {
    if (Auth.isLoggedIn()) {
      $scope.user = Auth.getCurrentUser();
    }
    $scope.amount = 5;

    $scope.submitAmount = function(amount) {
      $scope.amount = amount;
      $scope.submitted = true;
    };

    $scope.doCheckout = function() {
      $scope.donated = true;
    };
  });
