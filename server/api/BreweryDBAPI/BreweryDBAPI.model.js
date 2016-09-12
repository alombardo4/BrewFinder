'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var BreweryDBAPISchema = new mongoose.Schema({
  date: Date,
  apiID: String,
  action: String,
  rawData: String,
  type: String,
  nonce: String
});
module.exports = mongoose.model('BreweryDBAPI', BreweryDBAPISchema);
