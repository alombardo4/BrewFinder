'use strict';

angular.module('brewfinderwebApp')
  .service('menu', function () {
    var menu = {};
    menu.isOpen = false;
    return menu;
    // AngularJS will instantiate a singleton by calling "new" on this function
  });
