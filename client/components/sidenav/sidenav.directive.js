'use strict';

angular.module('brewfinderwebApp')
  .directive('sidenav', () => ({
    templateUrl: 'components/sidenav/sidenav.html',
    restrict: 'E',
    controller: 'SidenavController',
    controllerAs: 'sidenav'
  }));
