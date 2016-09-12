'use strict';

angular.module('brewfinderwebApp.auth', [
  'brewfinderwebApp.constants',
  'brewfinderwebApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
