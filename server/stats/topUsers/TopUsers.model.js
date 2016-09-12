'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;
var TopUserSchema = new mongoose.Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
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
module.exports = mongoose.model('TopUserStat', TopUserSchema);
