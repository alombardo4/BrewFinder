'use strict';

angular.module('brewfinderwebApp')
  .controller('UserCtrl', function ($scope, Auth, $stateParams, $state, userprofiles, checkins, follow) {
    $scope.state = $state.current.name;

    $scope.removeFollow = function(deleteFollow) {
      follow.deleteFollow(deleteFollow).then(function() {
        follow.getMyFollows().then(function(result) {
          $scope.user.follows = result.data;

        });
      });
    };
    if ($state.current.name === 'me') {
      userprofiles.getUser(Auth.getCurrentUser()._id).then(function(result) {
        $scope.user = result.data;
        checkins.getMyCheckins().then(function(result) {
          $scope.user.checkins = result.data;
        });
        follow.getMyFollows().then(function(result) {
          $scope.user.follows = result.data;

        });
      });
    } else {
      userprofiles.getUser($stateParams.id).then(function(result) {
        if (result.status === 404 || result.status === 400 || result.status === 500) {
          $scope.status = 'error';
        } else {
          $scope.user = result.data;
          follow.getUserFollows($scope.user).then(function(result) {
            $scope.user.follows = result.data;

          });
          checkins.getUserCheckins($scope.user._id).then(function(result) {
            $scope.user.checkins = result.data;
          });
        }
      }).catch(function() {
        $scope.status = 'error';
      });
    }




  });
