'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;
var ChainSchema = new mongoose.Schema({
  name: String,
  description: String,

});
module.exports = mongoose.model('Chain', ChainSchema);
