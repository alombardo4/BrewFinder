'use strict';

angular.module('brewfinderwebApp')
  .factory('userprofiles', function ($http) {
    // Service logic
    // ...

    // Public API here
    return {
      getMe: function () {
        return $http.get('/api/users/me');
      },
      getUser: function(id) {
        return $http.get('/api/users/show/' + id);
      },
      updateSettings: function(user) {
        return $http.put('/api/users/' + user._id + '/settings', user);
      }
    };
  });
