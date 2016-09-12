/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/follows              ->  index
 * POST    /api/follows              ->  create
 * GET     /api/follows/:id          ->  show
 * PUT     /api/follows/:id          ->  update
 * DELETE  /api/follows/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Follow = require('./Follow.model');
var User = require('../user/user.model');
var Brewery = require('../Brewery/Brewery.model');
var async = require('async');
var _ = require('lodash');

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

// Gets a list of Follows
exports.index = function(req, res) {
  Follow.find()
        .sort('-date')
        .limit(100)
        .exec(function(err, results) {
          if (err) return res.status(500).send(err);
          return res.json(results);
        });
}

exports.my = function(req, res) {
  Follow.find({_id : {$in : req.user.follows}})
        .sort('-date')
        .populate('beer brewery store')
        .exec(function(err, results) {
          if (err) return res.status(500).send(err);
          var follows = [];
          async.each(results, function(follow, callback) {
            if (follow.beer) {
              var bids = _.map(follow.beer.breweries, function(brew) { return brew.apiID;});
              Brewery.find({apiID : {$in : bids}})
                      .exec(function(err, breweries) {
                        if (err) callback(err);
                        else {
                          follow = follow.toObject();
                          follow.beer.breweries = breweries;
                          follows.push(follow);
                          callback();
                        }
                      });
            } else {
              follows.push(follow.toObject());
              callback();
            }
          }, function(err) {
            if (err) return res.status(500).send(err);
            return res.json(follows);

          });
        });
}

exports.forUser = function(req, res) {
  User.find({$and  : [{_id : req.params.id}, {private: false}]})
      .exec(function(err, users) {
        if (err) return res.status(500).send(err);
        if (!users || users.length === 0) return res.status(404).send([]);
        Follow.find({_id : {$in : users[0].follows}})
              .sort('-date')
              .populate('beer brewery store')
              .exec(function(err, results) {
                if (err) return res.status(500).send(err);
                var follows = [];
                async.each(results, function(follow, callback) {
                  if (follow.beer) {
                    var bids = _.map(follow.beer.breweries, function(brew) { return brew.apiID;});
                    Brewery.find({apiID : {$in : bids}})
                            .exec(function(err, breweries) {
                              if (err) callback(err);
                              else {
                                follow = follow.toObject();
                                follow.beer.breweries = breweries;
                                follows.push(follow);
                                callback();
                              }
                            });
                  } else {
                    follows.push(follow.toObject());
                    callback();
                  }
                }, function(err) {
                  if (err) return res.status(500).send(err);
                  return res.json(follows);

                });
              });
      });
}

// Gets a single Follow from the DB
exports.show = function(req, res) {
  Follow.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Creates a new Follow in the DB
exports.create = function(req, res) {
  if (req.body.beer) {
    req.body.brewery = null;
    req.body.store = null;
  } else if (req.body.brewery) {
    req.body.beer = null;
    req.body.store = null;
  } else if (req.body.store) {
    req.body.beer = null;
    req.body.brewery = null;
  } else {
    return res.status(400).json({msg: 'No followable entity specified'});
  }
  req.body.createdAt = new Date();
  Follow.create(req.body, function(err, follow) {
    if (err) {
      return res.status(500).json(err);
    }
    req.user.follows.push(follow);
    req.user.save(function(err, user) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(201).json(follow);
    });
  });
}


// Deletes a Follow from the DB
exports.destroy = function(req, res) {
  Follow.findById(req.params.id).exec(function(err, follow) {
    if (req.user.follows.indexOf(follow)) {
      req.user.follows.splice(req.user.follows.indexOf(follow), 1);
      follow.remove(function(err, result) {
        if (err) return res.status(500).json(err);
        return res.json(req.user);
      });
    }
  });
}
