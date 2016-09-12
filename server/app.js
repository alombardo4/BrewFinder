/**
 * Main application file
 */

'use strict';

var express = require('express');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var config = require('./config/environment');
var http = require('http');
var BreweryDBAPI = require('./api/BreweryDBAPI/BreweryDBAPI.controller');
var BeerModel = require('./api/Beer/Beer.model');
var cluster = require('cluster');
var BreweryModel = require('./api/Brewery/Brewery.model');
var ZipModel = require('./api/Zip/Zip.model');
var Zip = require('./api/Zip/Zip.controller');
var CheckinStatCalculator = require('./stats/checkins/CheckinStatCalculator');
var TopUserStatCalculator = require('./stats/topUsers/TopUsers.js');
// Connect to MongoDB
if (cluster.isMaster) {

  mongoose.connect(config.mongo.uri, config.mongo.options);
  mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
  });
  // Populate databases with sample data
  if (config.seedDB) { require('./config/seed'); }
  // BeerModel.count().exec(function(err, results) {
  //   console.log('Checking if beers exist');
  //   if (results === 0) {
  //     BreweryDBAPI.runFullPullBeer();
  //   }
  // });
  var cpuCount = require('os').cpus().length;
  for (var i = 0; i < cpuCount; i++) {
    cluster.fork();
  }
  if (config.runSearchNames) {
    // make searchable names for Beers and Breweries
    BreweryDBAPI.createBeerSearchNames();
    BreweryDBAPI.createBrewerySearchNames();

  }
  BeerModel.count().exec(function(err, results) {
    console.log('Checking if beers exist');
    if (results === 0) {
      console.log('Starting Beer var');
      BreweryDBAPI.runFullPullBeer();
    } else {
      console.log('Beers found!');
    }
  });
  BreweryModel.count().exec(function(err, results) {
    console.log('Checking if breweries exist');
    if (results === 0) {
      console.log('Starting Brewery import');
      BreweryDBAPI.runFullPullBreweries();
    } else {
      console.log('Breweries found!');
    }
  });
  ZipModel.count().exec(function(err, results) {
    console.log('Checking if Zips exist');
    if (results === 0) {
      console.log('Starting Zip import');
      Zip.importZipsFromJSON();
    } else {
      console.log('Zips found!');
    }
  });
  CheckinStatCalculator.runCheckinStats();
  TopUserStatCalculator.runTopUserStat();
  var CronJob = require('cron').CronJob;
  //job for updating standard mode
  new CronJob('00 00 */6 * * *', function(){
    CheckinStatCalculator.runCheckinStats();
    TopUserStatCalculator.runTopUserStat();
  }, null, true, "America/New_York");

} else {
  mongoose.connect(config.mongo.uri, config.mongo.options);
  mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
  });

  // Setup server
  var app = express();
  var server = http.createServer(app);
  var socketio = require('socket.io')(server, {
    serveClient: config.env !== 'production',
    path: '/socket.io-client'
  });
  require('./config/socketio')(socketio);
  require('./config/express')(app);
  require('./routes')(app);

  // Start server


  setImmediate(startServer);

  // Expose app
  exports = module.exports = app;
}

cluster.on('exit', function(worker) {
  console.log('Worker %d died. Restarting', worker.id);
  cluster.fork();
})

function startServer() {


  server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}
