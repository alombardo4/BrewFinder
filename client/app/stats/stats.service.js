'use strict';

angular.module('brewfinderwebApp')
  .factory('stats', function ($http) {
    // Service logic
    // ...

    // Public API here
    return {
      getTopLocalBeers: function (zip) {
        return $http.get('/api/Stats/topCheckinsForZip/' + zip);
      },
      getTopLocalUsers: function(zip) {
        return $http.get('/api/Stats/topUsersForZip/' + zip);
      }
    };
  });
