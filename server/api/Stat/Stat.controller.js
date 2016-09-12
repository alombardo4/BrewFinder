/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/Stats              ->  index
 * POST    /api/Stats              ->  create
 * GET     /api/Stats/:id          ->  show
 * PUT     /api/Stats/:id          ->  update
 * DELETE  /api/Stats/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Locality = require('../Locality/Locality.model');
var StatRun = require('../../stats/runner/StatRun.model');
var CheckinStat = require('../../stats/checkins/CheckinStat.model');
var TopUserStat = require('../../stats/topUsers/TopUsers.model');
var async = require('async');
var Brewery = require('../Brewery/Brewery.model');

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

exports.topUsersForZip = function(req, res) {
  // figure out locality based on Zip
  Locality.find({zipCodes : req.params.zip}).exec(function(error, localities) {
    if (error) return res.status(500).send(error);
    if (!localities || localities.length === 0) return res.status(404).end();
    // if locality, then lookup most recent stats run

    StatRun.find({$and : [{locality : localities[0]._id}, {type : 'topUserStat'}]}).sort('-runDate').limit(1).exec(function(err, statRuns) {
      if (err) return res.status(500).send(err);
      if (!statRuns || statRuns.length === 0) return res.status(404).end();
      // find all checkinstats for given stats run in locality, sort by count
      TopUserStat.find({$and : [{statRun : statRuns[0]._id}, {locality : localities[0]}]})
                  .populate('user', 'alias name _id')
                  .limit(20)
                  .sort('-checkinCount')
                  .exec(function(err, topUserStats) {
                    if (err) return res.status(500).send(err);
                    if (!topUserStats) return res.status(404).send([]);
                    return res.json(topUserStats);
                  });
    });
  });
}

exports.topCheckinsForZip = function(req, res) {
  // figure out locality based on Zip
  Locality.find({zipCodes : req.params.zip}).exec(function(error, localities) {
    if (error) return res.status(500).send(error);
    if (!localities || localities.length === 0) return res.status(404).end();
    // if locality, then lookup most recent stats run
    StatRun.find({$and : [{locality : localities[0]._id}, {type : 'checkinStat'}]}).sort('-runDate').limit(1).exec(function(err, statRuns) {
      if (err) return res.status(500).send(err);
      if (!statRuns || statRuns.length === 0) return res.status(404).end();
      // find all checkinstats for given stats run in locality, sort by count
      var returnCheckins = [];
      CheckinStat.find({$and : [{statRun : statRuns[0]._id}, {locality : localities[0]}]})
                  .populate('beer')
                  .sort('-checkinCount')
                  .limit(20)
                  .exec(function(err, checkinStats) {
                    if (err) return res.status(500).send(err);
                    if (!checkinStats) return res.status(404).send([]);
                    async.each(checkinStats, function(checkinStat, callback) {
                      var breweryIds = _.map(checkinStat.beer.breweries, function(brewery) { return brewery.apiID; });
                      Brewery.find({apiID : {$in : breweryIds}})
                              .exec(function(err, results) {
                                if (err) return callback(err);
                                checkinStat = checkinStat.toObject();
                                checkinStat.beer.breweries = results;
                                returnCheckins.push(checkinStat);
                                return callback();
                              });
                    }, function(err) {
                      if (err) return res.status(500).send(err);
                      return res.json(returnCheckins);
                    });
                  });
    });
  });

};
