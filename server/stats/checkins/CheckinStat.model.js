'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;
var CheckinStatSchema = new mongoose.Schema({
  beer: {
    type: Schema.ObjectId,
    ref: 'Beer'
  },
  locality: {
    type: Schema.ObjectId,
    ref: 'Locality'
  },
  checkinCount: Number,
  statRun: {
    type: Schema.ObjectId,
    ref: 'StatRun'
  }
});
module.exports = mongoose.model('CheckinStat', CheckinStatSchema);
