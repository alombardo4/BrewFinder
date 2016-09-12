'use strict';

angular.module('brewfinderwebApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('stores', {
        url: '/stores/:id',
        templateUrl: 'app/stores/stores.html',
        controller: 'StoresCtrl'
      });
  });
