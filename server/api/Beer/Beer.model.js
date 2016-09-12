'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;
var BeerSchema = new mongoose.Schema({
  name: String,
  nameShortDisplay: String,
  searchName: String,
  apiID: String,
  abv: Number,
  ibu: Number,
  description: String,
  foodPairings: String,
  servingTemperatureDisplay: String,
  available: {
    id: Number,
    name: String,
    description:String
  },
  year: String,
  glass: {
    id: Number,
    name: String
  },
  style: {
    id: Number,
    category: {
      id: Number,
      name: String
    },
    name: String,
    description: String
  },

  labels: {
    medium: String,
    large: String,
    icon: String
  },
  breweries: [{
    apiID: String
  }]
});
module.exports = mongoose.model('Beer', BeerSchema);
