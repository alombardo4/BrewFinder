'use strict';

angular.module('brewfinderwebApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('Search', {
        url: '/search?mode&query&zip',
        templateUrl: 'app/Search/Search.html',
        controller: 'SearchCtrl',

      });
  });
