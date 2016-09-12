'use strict';

angular.module('brewfinderwebApp')
  .factory('beer', function ($http) {
    // Service logic
    // Public API here
    return {
      getBeer(id) {
        return $http.get('/api/beers/' + id);
      },
      getBeers() {
        return $http.get('/api/beers');
      },
      getBeersByBrewery(id) {
        return $http.get('/api/beers/byBrewery/' + id);
      }
    };
  });
