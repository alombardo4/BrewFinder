/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/BreweryDBAPIs              ->  index
 * POST    /api/BreweryDBAPIs              ->  create
 * GET     /api/BreweryDBAPIs/:id          ->  show
 * PUT     /api/BreweryDBAPIs/:id          ->  update
 * DELETE  /api/BreweryDBAPIs/:id          ->  destroy
 */

'use strict';

var _ = require( 'lodash' );
var sha1 = require( 'sha1' );
var async = require( 'async' );
var request = require( 'request' );
var BreweryDBAPI = require( './BreweryDBAPI.model' );
var config = require( '../../config/environment/index.js' );
var Beer = require( '../Beer/Beer.model' );
var Brewery = require( '../Brewery/Brewery.model' );

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

exports.createBeerSearchNames = function() {
  Beer.count().exec(function(err, result) {
    if (err) return err;
    Beer.find({}).limit(result).exec(function(err, beers) {
      if (err) return err;
      var index = 0;
      async.eachLimit(beers, 20, function(beer, callback) {
        index++;
        if (index % 100 === 0) {
          console.log('Still going...');
        }
        if (beer.name) {
          beer.searchName = beer.name.stripAccents();
          beer.save(function(err, result) {
            if (err) callback(err);
            else callback();
          });
        } else {
          callback();
        }

      }, function(err) {
        console.log('Done');
        if (err) return err;
        return true;
      });
    })
  })
}

exports.createBrewerySearchNames = function() {
  Brewery.count({}).exec(function(err, result) {
    if(err) return err;
    console.log(result);
    Brewery.find({}).limit(result).exec(function(err, breweries) {
      async.eachLimit(breweries, 20, function(brewery, callback) {
        if (brewery.name) {
          brewery.searchName = brewery.name.stripAccents();
          if (brewery.searchName !== brewery.name) {
            console.log(brewery.searchName);
          }
          brewery.save(function(err, result) {
            if (err) callback(err);
            else callback();
          });
        } else {
          callback();
        }

      }, function(err) {
        if (err) return err;
        else return true;
      });
    });
  });
}

String.prototype.stripAccents = function() {
    var translate_re = /[àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ]/g;
    var translate = 'aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY';
    return (this.replace(translate_re, function(match){
        return translate.substr(translate_re.source.indexOf(match)-1, 1); })
    );
};

exports.runFullPullBeer = function() {
  var currentPage = 1;
  var numPages = 1;
  console.log('Running full beer pull...might take a while');
  request.get(buildBeerURL(currentPage), function(error, response, body) {
    body = JSON.parse(body);
    numPages = body.numberOfPages;
    console.log(numPages + ' pages exist. Starting...');
    console.log(1);
    async.each(body.data, beerAddCallback, function(err) {
      if (err) console.log(err);
      currentPage++;
      var pageArray = buildPageArray(currentPage, numPages);
      async.eachLimit(pageArray, 5, function(page, callback) {
        console.log(page);
        request.get(buildBeerURL(page), function(error, response, body) {
          body = JSON.parse(body);
          async.each(body.data, beerAddCallback, function(err) {
            if (err) callback(err);
            callback();
          });
        });
      }, function(err) {
        console.log('Done!');
      });
    });
  });

}

exports.runFullPullBreweries = function() {
  var currentPage = 1;
  var numPages = 1;
  console.log('Running full brewery pull...might take a while');
  request.get(buildBreweryURL(currentPage), function(error, response, body) {
    body = JSON.parse(body);
    numPages = body.numberOfPages;
    console.log(numPages + ' pages exist. Starting...');
    console.log(1);
    async.each(body.data, breweryAddCallback, function(err) {
      if (err) console.log(err);
      currentPage++;
      var pageArray = buildPageArray(currentPage, numPages);
      async.eachLimit(pageArray, 5, function(page, callback) {
        console.log(page);
        request.get(buildBreweryURL(page), function(error, response, body) {
          body = JSON.parse(body);
          async.each(body.data, breweryAddCallback, function(err) {
            if (err) callback(err);
            callback();
          });
        });
      }, function(err) {
        console.log('Done!');
      });
    });
  });
}

exports.runBeerUpdate = function(req, res) {
  var queryString = req.params.query;
  console.log(req.params);
  // $isValidRequest = sha1($apiKey . $_GET['nonce']) == $_GET['key'];
  var isValid = sha1(config.breweryDBKey + req.param('nonce')) === req.param('key');
  if (isValid) {
    //pull data
    var body = req.body;
    var bdbapi = new BreweryDBAPI();
    bdbapi.apiID = body.attributeId;
    bdbapi.action = body.action;
    bdbapi.type = body.attribute;
    bdbapi.nonce = req.param('nonce');
    bdbapi.rawData = JSON.stringify(body);
    bdbapi.date = new Date();
    //save item in DB
    bdbapi.save(function(err, bdbapi) {
      if (err) return res.status(500).send(err);
      //lookup item and update in database
      if (bdbapi.action !== 'delete') {
        request.get(buildBeerUpdateURL(bdbapi.apiID), function(error, response, body) {
          if (error) return res.status(500).send(error);
          var beer = JSON.parse(body);
          if (beer.status === 'failure') {
            return res.status(400).send(error);
          } else {
            beer = beer.data;
            beer.breweries = cleanBeerBrewery(beer.breweries);
            if (beer.name) {
              beer.searchName = beer.name.stripAccents();
            }
            Beer.findOne({apiID : beer.id}).exec(function(err, dbBeer) {
              if (err) return res.status(400).send(err);
              //already in db, update it
              if (dbBeer) {
                dbBeer = _.merge(dbBeer, beer, beerMerge);
                dbBeer.save(function(err, beer) {
                  if (err) return res.status(400).send(err);
                  return res.status(200).json(beer);
                });
              } else { //not in db, just save
                beer.apiID = beer.id;
                var saveBeer = new Beer(beer);
                saveBeer.save(function(err, beer) {
                  if (err) return res.status(400).send(err);
                  return res.status(200).json(beer);
                });
              }
            });
          }

        });
      }
    });
  } else {
    res.status(400).json({msg : 'Invalid key'});
  }
}

exports.runBreweryUpdate = function(req, res) {
  var queryString = req.params.query;
  console.log(req.params);
  // $isValidRequest = sha1($apiKey . $_GET['nonce']) == $_GET['key'];
  var isValid = sha1(config.breweryDBKey + req.param('nonce')) === req.param('key');
  if (isValid) {
    //pull data
    var body = req.body;
    var bdbapi = new BreweryDBAPI();
    bdbapi.apiID = body.attributeId;
    bdbapi.action = body.action;
    bdbapi.type = body.attribute;
    bdbapi.nonce = req.param('nonce');
    bdbapi.rawData = JSON.stringify(body);
    bdbapi.date = new Date();

    //save item in DB
    bdbapi.save(function(err, bdbapi) {
      if (err) return res.status(500).send(err);
      //lookup item and update in database
      if (bdbapi.action !== 'delete') {
        request.get(buildBreweryUpdateURL(bdbapi.apiID), function(error, response, body) {
          if (error) return res.status(500).send(error);

          var brewery = JSON.parse(body);
          if (brewery.status === 'failure') {
            return res.status(400).send(body);
          } else {
            brewery = brewery.data;
            if (brewery.name) {
              brewery.searchName = brewery.name.stripAccents();
            }
            Brewery.findOne({apiID : brewery.id}).exec(function(err, dbBrewery) {
              if (err) return res.status(500).send(err);
              //already in db, update it
              if (dbBrewery) {
                dbBrewery = _.merge(dbBrewery, brewery, beerMerge);
                dbBrewery.save(function(err, brewery) {
                  if (err) return res.status(400).send(err);
                  return res.status(200).json(brewery);
                });
              } else { //not in db, just save
                brewery.apiID = brewery.id;
                var saveBrewery = new Brewery(brewery);
                saveBrewery.save(function(err, brewery) {
                  if (err) return res.status(400).send(err);
                  return res.status(200).json(brewery);
                });
              }
            });
          }

        });
      }
    });
  } else {
    res.status(400).json({msg : 'Invalid key'});
  }
}

// Gets a list of BreweryDBAPIs
exports.index = function(req, res) {
  BreweryDBAPI.find().sort('-date').limit(250).exec(function(err, results) {
    if (err) return res.status(500).send(err);
    return res.json(results);
  })
}

exports.count = function(req, res) {
  BreweryDBAPI.count().exec(function(err, count) {
    if (err) return res.status(500).send(err);
    return res.json(count);
  });
}

function buildBeerURL(page) {
  return 'https://api.brewerydb.com/v2/beers?type=json&key=' + config.breweryDBKey + '&withBreweries=Y&p=' + page;
}

function buildBreweryURL(page) {
  return 'https://api.brewerydb.com/v2/breweries?type=json&key=' + config.breweryDBKey + '&withLocations=Y&withAlternateNames=Y&p=' + page;
}

function buildBeerUpdateURL(apiID) {
  return 'https://api.brewerydb.com/v2/beer/' + apiID + '?type=json&key=' + config.breweryDBKey + '&withBreweries=Y';
}

function buildBreweryUpdateURL(apiID) {
  return 'https://api.brewerydb.com/v2/brewery/' + apiID + '?type=json&key=' + config.breweryDBKey + '&withLocations=Y&withAlternateNames=Y';
}



function beerMerge(objectValue, srcValue) {
  if (srcValue) return srcValue;
  return objectValue;
}

function buildPageArray(start, end) {
    var arr = [];
    for (var i = start; i <= end; i++) {
      arr.push(i);
    }
    return arr;
}

var beerAddCallback = function(beer, callback) {
  //lookup if beer already in db
  beer.breweries = cleanBeerBrewery(beer.breweries);
  Beer.findOne({apiID : beer.id}).exec(function(err, dbBeer) {
    if (err) callback(err);
    //already in db, update it
    if (dbBeer) {
      dbBeer = _.merge(dbBeer, beer, beerMerge);
      if (dbBeer.name) {
        dbBeer.searchName = dbBeer.name.stripAccents();
      }
      dbBeer.save(function(err, beer) {
        if (err) callback(err);
        callback();
      });
    } else { //not in db, just save
      beer.apiID = beer.id;
      var saveBeer = new Beer(beer);
      if (saveBeer.name) {
        saveBeer.searchName = saveBeer.name.stripAccents();
      }
      saveBeer.save(function(err, beer) {
        if (err) callback(err);
        callback();
      });
    }
  });
}

var breweryAddCallback = function(brewery, callback) {
  Brewery.findOne({apiID : brewery.id}).exec(function(err, dbBrewery) {
    if (err) return callback(err);
    //already in db, update it
    if (dbBrewery) {
      dbBrewery = _.merge(dbBrewery, brewery, beerMerge);
      if (dbBrewery.name) {
        dbBrewery.searchName = dbBrewery.name.stripAccents();
      }
      dbBrewery.save(function(err, brewery) {
        if (err) return callback(err);
        return callback();
      });
    } else { //not in db, just save
      brewery.apiID = brewery.id;
      var saveBrewery = new Brewery(brewery);
      if (saveBrewery.name) {
        saveBrewery.searchName = saveBrewery.name.stripAccents();
      }
      saveBrewery.save(function(err, brewery) {
        if (err) return callback(err);
        return callback();
      });
    }
  });
}

function cleanBeerBrewery(breweries) {
  var newBreweries = [];
  if (breweries) {
    for (var i = 0; i < breweries.length; i++) {
      newBreweries.push({apiID : breweries[i].id});
    }
  }

  return newBreweries;
}
