'use strict';

angular.module('brewfinderwebApp')
  .directive('footer', function () {
    return {
      templateUrl: 'components/footer/footer.html',
      restrict: 'E',

    };
  });
