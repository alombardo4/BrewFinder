/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/stores              ->  index
 * POST    /api/stores              ->  create
 * GET     /api/stores/:id          ->  show
 * PUT     /api/stores/:id          ->  update
 * DELETE  /api/stores/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Store = require('./Store.model');
var request = require('request');
var config = require( '../../config/environment/index.js' );
var Locality = require('../Locality/Locality.model');
var async = require('async');

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function buildGmapsPlacesURL(location, pageToken) {
  var url = 'https://maps.googleapis.com/maps/api/place/radarsearch/json?key=' + config.googleServerAPIKey;
  if (pageToken) {
    url += '&pagetoken=' + pageToken;
  } else if (location) {
    url += '&radius=10000&types=liquor_store|grocery_or_supermarket&location=' + location.lat + ',' + location.lng;
  }
  return url;
}

function buildGmapsZipURL(locality, zip) {
  var url = 'https://maps.googleapis.com/maps/api/geocode/json?key=' + config.googleServerAPIKey + '&address=' + locality.city + ',' + locality.state + '%20' + zip;
  return url;
}

function buildGmapsPlaceURL(place_id) {
  var url = 'https://maps.googleapis.com/maps/api/place/details/json?key=' + config.googleServerAPIKey + '&placeid=' + place_id;
  return url;
}
exports.getAllFromGoogleForLocality = function(req, res) {
  Locality.findById(req.params.id).exec(function(err, locality) {
    if (err) return res.status(500).send(err);
    if (!locality) return res.status(404).send([]);

    var rawPlaces = [];
    //run for each zip code in locality
    async.each(locality.zipCodes, function(zipCode, callback) {
      request.get(buildGmapsZipURL(locality, zipCode), function(error, response, body) {
        if (error) return res.status(500).send(error);
        var location = JSON.parse(body).results;
        if (location[0]) {
          location = location[0].geometry.location;
          //start lookup of all places via gmaps
          var placesSearchResults = [];
          var next_page_token;
          //if next_page_token exists, run in loop
          var firstRun = true;
          (function loop(pagetoken) {
            if (next_page_token || pagetoken || firstRun) {
              request.get(buildGmapsPlacesURL(location, pagetoken), function(error, response, body) { //jshint ignore:line
                if (error) return res.status(500).send(error);

                body = JSON.parse(body);
                firstRun = false;
                next_page_token = body.next_page_token;
                var next_page = body.next_page_token;
                //parse through all the places
                placesSearchResults = placesSearchResults.concat(body.results);

                //delay to appease the google gods
                setTimeout(function() {
                  loop(next_page);
                }, 2000);
              });
            } else {
              //now lookup all info for each store
              rawPlaces = rawPlaces.concat(placesSearchResults);
              callback();
            }
          }());
        } else {
          callback();
        }

      });
    }, function(err) {
      rawPlaces = _.uniq(rawPlaces, 'place_id');
      var stores = [];
      async.each(rawPlaces, function(place, callback) {
        request.get(buildGmapsPlaceURL(place.place_id), function(error, response, body) { //jshint ignore:line
          if (error) return callback(error);
          body = JSON.parse(body);
          var store = {
            name : body.result.name,
            website: body.result.website,
            gmapsUrl: body.result.url,
            phone: body.result.formatted_phone_number,
            address: body.result.formatted_address,
            location: {
              postalCode: body.result.address_components[body.result.address_components.length-1].long_name
            },
            gplaceId: body.result.place_id
          };
          stores.push(store);
          return callback();
        });
      }, function(err) {
        return res.json(stores);
      });
    });

  });
};



// Gets a list of Stores
exports.index = function(req, res) {
  Store.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Gets a single Store from the DB
exports.show = function(req, res) {
  Store.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

exports.bulkCreate = function(req, res) {
  var stores = req.body;
  var count = 0;
  async.each(stores, function(store, callback) {
    Store.find({gplaceId : store.gplaceId})
        .exec(function(err, foundStores) {
          if (err) return callback(err);
          if (foundStores.length === 0) {
            Store.create(store, function(err, store) {
              if (err) return callback(err);
              count++;
              return callback();
            });
          } else {
            return callback();
          }
        });
  }, function(err) {
    if (err) return res.status(500).send(err);
    return res.json(count);
  });
}
// Creates a new Store in the DB
exports.create = function(req, res) {
  Store.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Store in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Store.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Deletes a Store from the DB
exports.destroy = function(req, res) {
  Store.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
