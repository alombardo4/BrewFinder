'use strict';

angular.module('brewfinderwebApp')
  .service('Search', function ($http, $location) {
    // Service logic
    // ...
    var query = '';
    var mode = '';
    var zip = '';
    // Public API here
    return {
      searchBeers: function(name) {
        return $http.get('/api/Search/beer/' + name);
      },
      searchBreweries: function(name) {
        return $http.get('/api/Search/brewery/' + name);
      },
      searchStores: function(name, zip) {
        return $http.get('/api/Search/store/' + name + '/' + zip);
      },
      setQuery: function(qry) {
        query = qry;
      },
      getQuery: function() {
        return query;
      },
      setMode: function(md) {
        mode = md;
      },
      getMode: function() {
        return mode;
      },
      setZip: function(z) {
        zip = z;
      },
      getZip: function() {
        return zip;
      },
      runSearch: function() {
        if (mode === 'store') {
          $location.path('search').search({query : query, zip: zip, mode: mode});
        } else {
          $location.path('search').search({query : query, mode: mode});

        }
      }
    };
  });
