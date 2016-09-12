'use strict';

angular.module('brewfinderwebApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('newStore', {
        url: '/store/new',
        templateUrl: 'app/store/store.html',
        controller: 'StoreCtrl',
        authenticate: 'admin'
      })
      .state('amendStore', {
        url: '/stores/:id/edit',
        templateUrl: 'app/store/store.html',
        controller: 'StoreCtrl',
        authenticate: 'admin'
      })
      .state('importStore', {
        url: '/store/import',
        templateUrl: 'app/store/import-store.html',
        controller: 'ImportStoreCtrl',
        authenticate: 'admin'
      });
  });
