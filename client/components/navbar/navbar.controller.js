'use strict';

angular.module('brewfinderwebApp')
  .controller('NavbarController', function ($scope, Auth, Search, $stateParams, $location, $timeout, location, menu, $mdMedia) {
    $scope.location = location;

    $scope.toggleMenu = function() {
      menu.isOpen = !menu.isOpen;
    };
    $scope.menu = menu;
    $scope.$watch(function() {
        return $mdMedia('gt-sm');
      }, function(large) {
        $scope.large = large;
      });
    $scope.$watch(function() {
      return $mdMedia('gt-xs');
    }, function(medium) {
      $scope.medium = medium;
    });
    $scope.searchData = {
      text: '',
      searchMode: 'beer',
      zip: ''
    };

    $scope.user = Auth.getCurrentUser();

    $scope.init = function() {
      location.updateLocation();
      $scope.getCurrentUser = Auth.getCurrentUser;
      $scope.searchData.searchMode = Search.getMode();
      $scope.searchData.text = Search.getQuery();
      $scope.searchData.zip = Search.getZip();
      if ($scope.searchData.searchMode === '') {
        $scope.searchData.searchMode = 'beer';
      }
    };

    $scope.$watch('location.zip', function() {
      if (location.zip !== null) {
        $scope.searchData.zip = location.getLocation();
      }
    });

    $scope.search = function() {
      Search.setQuery($scope.searchData.text);
      Search.setMode($scope.searchData.searchMode);
      Search.setZip($scope.searchData.zip);
      Search.runSearch();

    };

  });
