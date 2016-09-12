'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;
var FollowSchema = new mongoose.Schema({
  beer: {
    type: Schema.ObjectId,
    ref: 'Beer'
  },
  brewery: {
    type: Schema.ObjectId,
    ref: 'Brewery'
  },
  store: {
    type: Schema.ObjectId,
    ref: 'Store'
  },
  createdAt: Date

});
module.exports = mongoose.model('Follow', FollowSchema);
