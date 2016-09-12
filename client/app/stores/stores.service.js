'use strict';

angular.module('brewfinderwebApp')
  .factory('stores', function ($http) {
    // Service logic
    // ...


    // Public API here
    return {
      getStore: function (id) {
        return $http.get('/api/stores/' + id);
      },
      createStore: function(store) {
        return $http.post('/api/stores/', store);
      },
      updateStore: function(store) {
        return $http.put('/api/stores/' + store._id, store);
      },
      getPlacesStores: function(locality) {
        return $http.get('/api/stores/getAllFromGoogleForLocality/' + locality);
      },
      bulkCreateStores: function(stores) {
        return $http.post('/api/stores/bulk/import', stores);
      }
    };
  });
