'use strict';

angular.module('brewfinderwebApp')
  .controller('SidenavController', function ($scope, menu, Auth) {
    $scope.location = location;
    $scope.auth = Auth;

    $scope.toggleMenu = function() {
      menu.isOpen = !menu.isOpen;
    };
    $scope.hideMenu = function() {
      menu.isOpen = false;
    };

    $scope.init = function() {

    };


  });
