'use strict';

angular.module('brewfinderwebApp')
  .controller('CheckinCtrl', function ($scope, $state, $stateParams, beer, stores, Search, location, checkins) {
    $scope.checkins = [];
    checkins.getCheckin($stateParams.id).then(function(results) {
      $scope.checkin = results.data;
    });
  });
