/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/breweries              ->  index
 * POST    /api/breweries              ->  create
 * GET     /api/breweries/:id          ->  show
 * PUT     /api/breweries/:id          ->  update
 * DELETE  /api/breweries/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Brewery = require('./Brewery.model');
var Beer = require('../Beer/Beer.model');

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

// Gets a list of Brewerys
exports.index = function(req, res) {
  Brewery.find().limit(100).exec(function(err, results) {
    if (err) return res.status(500).send(err);
    return res.json(results);
  });
}

exports.findByApiID = function(req, res) {
  var apiID = req.params.apiID;
  Brewery.findOne({apiID : apiID}).exec(function(err, brewery) {
    if (err) return res.status(500).send(err);
    return res.json(brewery);
  })
}

exports.findByApiIDWithBeers = function(req, res) {
  var apiID = req.params.apiID;
  Brewery.findOne({apiID : apiID}).exec(function(err, brewery) {
    if (err) return res.status(500).send(err);
    Beer.find({'breweries.apiID' : apiID}).exec(function(err, beers) {
      brewery = brewery.toObject();
      brewery.beers = beers;
      return res.json(brewery);
    });
  });
}

// Gets a single Brewery from the DB
exports.show = function(req, res) {
  Brewery.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Creates a new Brewery in the DB
exports.create = function(req, res) {
  Brewery.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Brewery in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Brewery.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Deletes a Brewery from the DB
exports.destroy = function(req, res) {
  Brewery.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
