'use strict';

angular.module('brewfinderwebApp')
  .factory('brewerydb', function ($http) {
    // Service logic
    // ...


    // Public API here
    return {
      getBreweryDBUpdates: function() {
        return $http.get('/api/BreweryDBAPI');
      },
      getCount: function() {
        return $http.get('/api/BreweryDBAPI/count');
      }
    };
  });
