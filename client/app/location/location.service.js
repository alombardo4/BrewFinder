'use strict';

angular.module('brewfinderwebApp')
  .service('location', function ($http) {
    var location = {};
    location.zip = null;
    // AngularJS will instantiate a singleton by calling "new" on this function

  	location.getFullLocationFromBrowser = function(callback) {
  		return window.navigator.geolocation.getCurrentPosition(callback);
  	};
    location.getLocation = function() {
      return location.zip;
    };

    location.interpretPositionWithGMaps = function(pos) {
  		return $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + pos.coords.latitude + ','+ pos.coords.longitude + '&sensor=true');
  	};

    location.updateLocation = function(callback) {
      window.navigator.geolocation.getCurrentPosition(function(pos) {
        return location.interpretPositionWithGMaps(pos).then(function(result) {
          var fullAddress = result.data.results[0];
          fullAddress.address_components.forEach(function(component) { // jshint ignore:line
            if (component.types[0] === 'postal_code') {
              location.zip = component.long_name; // jshint ignore:line
            }
          });
          if (callback) {
            callback(location.zip);
          }
          return location.zip;
        });
      });
    };
    return location;
  });
