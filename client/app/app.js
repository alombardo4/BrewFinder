'use strict';

angular.module('brewfinderwebApp', [
  'brewfinderwebApp.auth',
  'brewfinderwebApp.admin',
  'brewfinderwebApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'validation.match',
  'ngMaterial',
  'stripe.checkout'
])
  .config(function($urlRouterProvider, $locationProvider, $mdThemingProvider) {
    $urlRouterProvider
      .otherwise('/');
    $mdThemingProvider.theme('default')
      .primaryPalette('grey')
      .accentPalette('brewfinderpalette', {
        'default' : '100',
        'hue-1' : '800',
        'hue-2' : '400',
        'hue-3' : '200'
      });
    $mdThemingProvider.definePalette('brewfinderpalette', {
    '50': 'ff473d',
    '100': 'ff473d',
    '200': '884fe8',
    '300': '884fe8',
    '400': '3385ff',
    '500': '3385ff',
    '600': '3ccf17',
    '700': '3ccf17',
    '800': 'ffcf33',
    '900': 'ffcf33',
    'A100': 'ff473d',
    'A200': '884fe8',
    'A400': '3ccf17',
    'A700': 'ffcf33',
    'contrastDefaultColor': 'light'    // whether, by default, text (contrast)
  });
    $locationProvider.html5Mode(true);
  });
