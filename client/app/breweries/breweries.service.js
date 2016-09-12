'use strict';

angular.module('brewfinderwebApp')
  .factory('breweries', function ($http) {
    // Service logic
    // ...

    // Public API here
    return {
      getBrewery: function (id) {
        return $http.get('/api/breweries/' + id);
      },
      getBreweries: function() {
        return $http.get('/api/breweries');
      }      
    };
  });
