'use strict';

angular.module('brewfinderwebApp')
  .factory('localities', function ($http) {
    // Service logic
    // ...


    // Public API here
    return {
      getLocalities: function () {
        return $http.get('/api/localities');
      },
      createLocality: function(locality) {
        return $http.post('/api/localities', locality);
      },
      deleteLocality: function(locality) {
        return $http.delete('/api/localities/' + locality._id);
      }
    };
  });
