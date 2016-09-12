'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;
var CheckinSchema = new mongoose.Schema({
  time: Date,
  quantity: Number,
  packageType: String,
  beer: {
    type: Schema.ObjectId,
    ref: 'Beer'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  store: {
    type: Schema.ObjectId,
    ref: 'Store'
  }
});
module.exports = mongoose.model('Checkin', CheckinSchema);
