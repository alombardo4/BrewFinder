/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/beers              ->  index
 * POST    /api/beers              ->  create
 * GET     /api/beers/:id          ->  show
 * PUT     /api/beers/:id          ->  update
 * DELETE  /api/beers/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var async = require('async');
var Brewery = require('../Brewery/Brewery.model');
var Beer = require('./Beer.model');

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

// Gets a list of Beers
exports.index = function(req, res) {
  Beer.find().limit(100).exec(function(err, results) {
    if (err) return res.status(500).send(err);
    return res.json(results);
  })

}

// Gets a single Beer from the DB
exports.show = function(req, res) {
  Beer.findById(req.params.id).exec(function(err, result) {
    if (err) return res.status(500).send(err);
    var breweries = [];
    async.each(result.breweries, function(brewery, callback) {
      Brewery.findOne({apiID : brewery.apiID}).exec(function(err, br) {
        if (err) callback(err);
        else {
          breweries.push(br.toObject());
          callback();
        }
      })
    }, function(err) {
      if (err) return res.status(500).send(err);
      result  = result.toObject();
      result.breweries = breweries;
      return res.json(result);
    })
  });

}

exports.getBeersForBrewery = function(req, res) {
  var apiID = req.params.apiID;
  Beer.find({'breweries.apiID': apiID}).exec(function(err, results) {
    if (err) return res.status(500).send(err);
    return res.json(results);
  });
}
