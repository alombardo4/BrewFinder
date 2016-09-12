'use strict';

var mongoose = require('mongoose');

var LocalitySchema = new mongoose.Schema({
  city: String,
  state: String,
  zipCodes: [String]
});

module.exports = mongoose.model('Locality', LocalitySchema);
