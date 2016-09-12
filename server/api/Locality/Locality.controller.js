/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/localities              ->  index
 * POST    /api/localities              ->  create
 * GET     /api/localities/:id          ->  show
 * PUT     /api/localities/:id          ->  update
 * DELETE  /api/localities/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Locality = require('./Locality.model');
var Zip = require('../Zip/Zip.model');
function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
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

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

exports.create = function(req, res) {
  var center = req.body.city;
  var state = req.body.state;

  var inputDistance = 50;

  Zip.findOne({zipCode: req.body.zip}).exec(function(err, zip) {
    var distance = inputDistance;

    //doing some maths to find ew and ns distance
    var latDist = distance * 0.621371 / 110.54;
    var currentLat = zip.latitude;
    var lonDist = distance * 0.621371 / (111.320 * Math.cos(currentLat));
    lonDist = Math.abs(lonDist);
    var maxLat = zip.latitude + latDist;
    var minLat = zip.latitude - latDist;
    var maxLon = zip.longitude + lonDist;
    var minLon = zip.longitude - lonDist;
    //lookup zips within distance
    return Zip.find({$and : [
      {latitude: { $gt: minLat, $lt: maxLat}},
      {longitude: { $gt: minLon, $lt: maxLon}},
    ]}).exec(function(err, allZips) {
      var zipCodes = _.pluck(allZips, 'zipCode');
      var local = {
        zipCodes: zipCodes,
        city: center,
        state: state
      };
      Locality.create(local, function(err, local) {
        if (err) return res.status(500).send(err);
        return res.json(local);
      });
    });

  });


};

exports.index = function(req, res) {
  Locality.find({}).exec(function(err, result) {
    if (err) return res.status(500).send(err);
    return res.json(result);
  });
};

exports.delete = function(req, res) {

  Locality.findById({_id : req.params.id}).exec(function(err, result) {
    if (err) return res.status(500).send(err);
    result.remove(function(err, result) {
      if (err) return res.status(500).send(err);
      return res.json(result);
    });
  });
}
