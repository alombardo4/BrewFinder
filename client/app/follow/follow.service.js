'use strict';

angular.module('brewfinderwebApp')
  .factory('follow', function ($http) {
    // Service logic
    // ...


    // Public API here
    return {
      createBeerFollow: function (beer) {
        return $http.post('/api/follows', {beer : beer});
      },
      createBreweryFollow: function (brewery) {
        return $http.post('/api/follows', {brewery : brewery});
      },
      createStoreFollow: function (store) {
        return $http.post('/api/follows', {store : store});
      },
      deleteFollow: function(follow) {
        return $http.delete('/api/follows/' + follow._id);
      },
      getAll: function() {
        return $http.get('/api/follows');
      },
      getFollow: function(id) {
        return $http.get('/api/follows/' + id);
      },
      getMyFollows: function() {
        return $http.get('/api/follows/my');
      },
      getUserFollows: function(user) {
        return $http.get('/api/follows/user/' + user._id);
      }
    };
  });
