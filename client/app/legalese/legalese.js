'use strict';

angular.module('brewfinderwebApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('privacy-policy', {
        url: '/legalese/privacy-policy',
        templateUrl: 'app/legalese/privacy-policy.html'
      })
      .state('terms-and-conditions', {
        url: '/legalese/terms-and-conditions',
        templateUrl: 'app/legalese/terms-and-conditions.html'
      })
      .state('about', {
        url: '/about',
        templateUrl: 'app/legalese/about.html',
        controller: 'AboutCtrl'
      });
  });
