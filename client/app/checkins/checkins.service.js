'use strict';

angular.module('brewfinderwebApp')
  .factory('checkins', function ($http) {
    // Service logic
    // ...


    // Public API here
    return {
      getCheckin: function (id) {
        return $http.get('/api/checkins/' + id);
      },
      getCheckins: function() {
        return $http.get('/api/checkins');
      },
      createCheckin: function(checkin) {
        return $http.post('/api/checkins', checkin);
      },
      getNearbyCheckins: function(zip) {
        return $http.get('/api/checkins/nearby/' + zip);
      },
      getBeerCheckins: function(beer, zip) {
        return $http.get('/api/checkins/nearby/' + zip + '/beer/' + beer);
      },
      getStoreCheckins: function(store) {
        return $http.get('/api/checkins/store/' + store);
      },
      getUserCheckins: function(id) {
        return $http.get('/api/checkins/byUser/' + id);
      },
      getMyCheckins: function() {
        return $http.get('/api/checkins/byUser/me/show');
      }
    };
  });
