/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/checkins              ->  index
 * POST    /api/checkins              ->  create
 * GET     /api/checkins/:id          ->  show
 * PUT     /api/checkins/:id          ->  update
 * DELETE  /api/checkins/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Checkin = require('./Checkin.model');
var Zip = require('../Zip/Zip.model');
var Store = require('../Store/Store.model');
var Brewery = require('../Brewery/Brewery.model');
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

// Gets a list of Checkins
exports.index = function(req, res) {
  Checkin.find().sort('-time').populate('user', '-password -salt -email -role -provider').populate('store').populate('beer').exec(function(err, result) {
    if (err) return res.status(500).send(err);
    return res.json(result);
  });
}

exports.byUser = function(req, res) {
  Checkin.find({user : req.params.id})
          .sort('-time')
          .populate('user', '-password -salt -email -role -provider')
          .populate('store')
          .populate('beer')
          .limit(10)
          .exec(function(err, results) {
            if (err) return res.status(500).send(err);

            if (results[0].user.private) return res.status(404).end();
            var checkins = [];
            async.each(results, function(checkin, callback) {
              Brewery.find({_id : {$in : checkin.beer.breweries}}).exec(function(err, breweries) {
                if (err) callback(err);
                else {
                  var bids = _.map(checkin.beer.breweries, function(brewery) { return brewery.apiID; });
                  Brewery.find({apiID : { $in : bids}}).exec(function(err, breweries) {
                    if (err) callback(err);
                    else {
                      checkin = checkin.toObject();
                      checkin.beer.breweries = breweries;
                      checkins.push(checkin);
                      callback();
                    }
                  });
                }
              });
            }, function(err) {
              if (err) return res.status(500).send(err);
              return res.json(checkins);
            });
          });
}

exports.me = function(req, res) {
  Checkin.find({user : req.user.id})
          .sort('-time')
          .populate('user', '-password -salt -email -role -provider')
          .populate('store')
          .populate('beer')
          .limit(20)
          .exec(function(err, results) {
            var checkins = [];
            async.each(results, function(checkin, callback) {
              var bids = _.map(checkin.beer.breweries, function(brewery) { return brewery.apiID; });
              Brewery.find({apiID : { $in : bids}}).exec(function(err, breweries) {
                if (err) callback(err);
                else {
                  checkin = checkin.toObject();
                  checkin.beer.breweries = breweries;
                  checkins.push(checkin);
                  callback();
                }
              });
            }, function(err) {
              if (err) return res.status(500).send(err);
              return res.json(checkins);
            });

          });
}


exports.nearby = function(req, res) {
  async.waterfall([
    function(callback) {
      var inputDistance = 20;

      Zip.findOne({zipCode: req.params.zip}).exec(function(err, zip) {
        var distance = inputDistance / 2.0;

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
          if (err) callback(err);
          var zipCodes = _.pluck(allZips, 'zipCode');
          callback(null, zipCodes);
        });

      });

    },
    function(zipCodes, callback) {
      Store
        .find({ 'location.postalCode' : { $in : zipCodes }})
        .sort('name')
        .exec(function(err, results) {
          if (err) callback(err);
          var stores = _.pluck(results, '_id');
          callback(null, stores);
        });
    },
    function(stores, callback) {
      Checkin.find({'store' : { $in : stores}}).sort('-time').populate('user', '-password -salt -email -role -provider').populate('store').populate('beer').limit(20).exec(function(err, result) {
        if (err) callback(err);
        callback(null, result);
      });
    }], function(err, checkins) {
      var values = [];
      async.each(checkins, function(checkin, callback) {
        checkin = checkin.toObject();
        var breweries = [];
        async.each(checkin.beer.breweries, function(apiID, callback) {
          Brewery.findOne({apiID : apiID.apiID}).exec(function(err, result) {
            if (err) callback(err);
            else {
              breweries.push(result.toObject());
              callback();
            }
          });
        }, function(err) {
          checkin.beer.breweries = breweries;
          if (err) callback(err);
          else {
            values.push(checkin);
            callback();
          }
        });
      }, function(err) {
        if (err) return res.status(500).send(err);
        return res.json(values);
      });
    });
}

// Gets a single Checkin from the DB
exports.show = function(req, res) {
  Checkin.findById(req.params.id).populate('user', '-password -salt -email -role -provider').populate('store').populate('beer').exec(function(err, result) {
    if (err) return res.status(500).send(err);

    var brew = [];
    var checkin = result.toObject();
    async.each(checkin.beer.breweries, function(brewery, callback) {
      Brewery.findOne({apiID : brewery.apiID}).exec(function(err, result) {
        if (err) callback(err);
        else {
          brew.push(result.toObject());
          callback();
        }
      });
    }, function(err) {
      if (err) return res.status(500).send(err);
      else {
        checkin.beer.breweries = brew;
        return res.json(checkin);
      }
    });
  });
}


// Gets nearby checkins for a beer
exports.beerCheckins = function(req, res) {
  async.waterfall([
    function(callback) {
      var inputDistance = 20;

      Zip.findOne({zipCode: req.params.zip}).exec(function(err, zip) {
        var distance = inputDistance / 2.0;

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
          if (err) callback(err);
          var zipCodes = _.pluck(allZips, 'zipCode');
          callback(null, zipCodes);
        });

      });

    },
    function(zipCodes, callback) {
      Store
        .find({ 'location.postalCode' : { $in : zipCodes }})
        .sort('name')
        .exec(function(err, results) {
          if (err) callback(err);
          var stores = _.pluck(results, '_id');
          callback(null, stores);
        });
    },
    function(stores, callback) {
      Checkin.find({ $and : [{'store' : { $in : stores}}, {'beer' : req.params.beer}]}).sort('-time').populate('user', '-password -salt -email -role -provider').populate('store').populate('beer').limit(100).exec(function(err, result) {
        if (err) callback(err);
        callback(null, result);
      });
    }], function(err, checkins) {
      var values = [];
      async.each(checkins, function(checkin, callback) {
        checkin = checkin.toObject();
        var breweries = [];
        async.each(checkin.beer.breweries, function(apiID, callback) {
          Brewery.findOne({apiID : apiID.apiID}).exec(function(err, result) {
            if (err) callback(err);
            else {
              breweries.push(result.toObject());
              callback();
            }
          });
        }, function(err) {
          checkin.beer.breweries = breweries;
          if (err) callback(err);
          else {
            values.push(checkin);
            callback();
          }
        });
      }, function(err) {
        if (err) return res.status(500).send(err);
        return res.json(values);
      });
    });
}

exports.storeCheckins = function(req, res) {
  Checkin.find({store : req.params.id}).sort('-time').populate('user', '-password -salt -email -role -provider').populate('store').populate('beer').limit(100).exec(function(err, checkins) {
    if (err) return res.status(500).send(err);
    var values = [];
    async.each(checkins, function(checkin, callback) {
      checkin = checkin.toObject();
      var breweries = [];
      async.each(checkin.beer.breweries, function(apiID, callback) {
        Brewery.findOne({apiID : apiID.apiID}).exec(function(err, result) {
          if (err) callback(err);
          else {
            breweries.push(result.toObject());
            callback();
          }
        });
      }, function(err) {
        checkin.beer.breweries = breweries;
        if (err) callback(err);
        else {
          values.push(checkin);
          callback();
        }
      });
    }, function(err) {
      if (err) return res.status(500).send(err);
      return res.json(values);
    });
  });
}


// Creates a new Checkin in the DB
exports.create = function(req, res) {
  req.body.user = req.user;
  req.body.time = new Date();
  if (req.body.store && req.body.beer && req.body.user && req.body.quantity && req.body.packageType) {
    Checkin.createAsync(req.body)
      .then(responseWithResult(res, 201))
      .catch(handleError(res));
  } else {
    return res.status(403).end();
  }

}

// Updates an existing Checkin in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Checkin.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Deletes a Checkin from the DB
exports.destroy = function(req, res) {
  Checkin.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
