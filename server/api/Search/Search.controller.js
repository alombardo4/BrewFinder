/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/Search              ->  index
 * POST    /api/Search              ->  create
 * GET     /api/Search/:id          ->  show
 * PUT     /api/Search/:id          ->  update
 * DELETE  /api/Search/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Beer = require('../Beer/Beer.model');
var Brewery = require('../Brewery/Brewery.model');
var Store = require('../Store/Store.model');
var Chain = require('../Chain/Chain.model');
var Zip = require('../Zip/Zip.model');
var async = require('async');

exports.searchBeer = function(req,res) {
  var terms = req.params.term.split(' ');
  var beers = [];
  async.each(terms, function(term, callback) {
    Beer
      .find({ $or : [{ name : { "$regex": term, "$options": "i" }},
                     { searchName: { "$regex" : term, "$options" : "i"}}]})
      .lean()
      .limit(25)
      .sort('name')
      .exec(function(err, results) {
        if (err) callback(err);
        else {
          async.each(results, function(beer, callback2) {
            var breweries = [];
            async.each(beer.breweries, function(breweryID, callback3) {
              Brewery
                .findOne({apiID : breweryID.apiID})
                .lean()
                .exec(function(err, result) {
                  if (err) callback3(err);
                  else {
                    breweries.push(result);
                    callback3();
                  }
                });
            }, function(err) {
              if(err) callback2(err);
              else {
                beer.breweries = breweries;
                beers.push(beer);
                callback2();
              }
            });

          }, function(err) {
            if (err) callback(err);
            callback();
          });
        }
      });
  }, function(err) {
    if(err) return res.status(500).send(err);
    var maxScore = beerMaximumScore(req.params.term);
    beers = _.uniq(beers, function(beer) {
      return beer._id.toString();
    });
    if (beers.length > 10) {
      beers = _.filter(beers, function(beer) {
        return beerNameScore(beer, req.params.term) >= maxScore / 2.0;
      });
    }
    beers = _.sortBy(beers, function(beer) {
      return -1 * beerNameScore(beer, req.params.term);
    });
    return res.json(beers);
  });

}

function beerNameScore(beer, query) {
  if (beer.name.trim().toLowerCase() === query.trim().toLowerCase()) {
    return beerMaximumScore(query) + 1;
  } else {
    var totalScore = 0;
    var queryParts = query.toLowerCase().split(' ');
    var beerNameParts = beer.name.toLowerCase().split(' ');
    if (beer.breweries.length > 0) {
      var breweryNameParts = beer.breweries[0].name.toLowerCase().split(' ');
      totalScore += _.intersection(queryParts, breweryNameParts).length;
    }
    totalScore += _.intersection(queryParts, beerNameParts).length;
    return totalScore;
  }
}
function beerMaximumScore(query) {
  return query.toLowerCase().split(' ').length + 1;
}

exports.searchBrewery = function(req,res) {
  var terms = req.params.term.split(' ');
  var breweries = [];
  async.each(terms, function(term, callback) {
    Brewery
      .find({ $or : [{ name : { "$regex": term, "$options": "i" }},
                     { searchName: { "$regex" : term, "$options" : "i"}}]})      .lean()
      .limit(50)
      .sort('name')
      .exec(function(err, results) {
        if(err) callback(err);
        else {
          breweries = _.union(breweries, results);
          callback();
        }
      });
  }, function(err) {
    if (err) return res.status(500).send(err);
    var maxScore = breweryMaximumScore(req.params.term);
    breweries = _.uniq(breweries, function(brewery) {
      return brewery._id.toString();
    });
    if (breweries.length > 10) {
      breweries = _.filter(breweries, function(brewery) {
        return breweryNameScore(brewery, req.params.term) >= breweryMaximumScore(req.params.term) / 2.0;
      });
    }
    breweries = _.sortBy(breweries, function(brewery) {
      return -1 * breweryNameScore(brewery, req.params.term);
    });

    return res.json(breweries);
  });

}

function breweryNameScore(brewery, query) {
  if (brewery.name.trim().toLowerCase() === query.trim().toLowerCase()) {
    return breweryMaximumScore(query) + 1;
  } else {
    var totalScore = 0;
    var queryParts = query.toLowerCase().split(' ');
    var breweryNameParts = brewery.name.toLowerCase().split(' ');
    totalScore += _.intersection(queryParts, breweryNameParts).length;
    return totalScore;
  }
}
function breweryMaximumScore(query) {
  return query.toLowerCase().split(' ').length + 1;
}


exports.searchStore = function(req,res) {
  async.waterfall([
    function(callback) {
      var inputDistance = 25;

      Zip.findOne({zipCode: req.params.zip}).exec(function(err, zip) {
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
          if (err) callback(err);
          var zipCodes = _.pluck(allZips, 'zipCode');
          callback(null, zipCodes);
        });

      });

    },
    function(zipCodes, callback) {
        Store
          .find({$and : [
                          { name : { "$regex": req.params.term, "$options": "i" }},
                          { 'location.postalCode' : { $in : zipCodes }}

                        ]})
          .limit(50)
          .sort('name')
          .exec(function(err, results) {
            if (err) callback(err);
            callback(null, results);
          });
    }], function(err, result) {
      if (err) return res.status(500).send(err);
      return res.json(result);
    });

}

exports.searchChain = function(req,res) {
  Chain
    .find({ name : { "$regex": req.params.term, "$options": "i" }})
    .limit(50)
    .sort('name')
    .exec(function(err, results) {
      if (err) return res.status(500).send(err);
      return res.json(results);
    });
}
