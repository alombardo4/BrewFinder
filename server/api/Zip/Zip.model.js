'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var ZipSchema = new mongoose.Schema({
  zipCode: Number,
	primaryCity: String,
	cities: [String],
	state: String,
	latitude: Number,
	longitude: Number
});

module.exports = mongoose.model('Zip', ZipSchema);
