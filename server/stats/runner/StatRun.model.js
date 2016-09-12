'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;
var StatRunSchema = new mongoose.Schema({
  type: String,
  runDate: Date,
  locality: {
    type: Schema.ObjectId,
    ref: 'Locality'
  }
});
module.exports = mongoose.model('StatRun', StatRunSchema);
