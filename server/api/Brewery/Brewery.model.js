'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;
var BrewerySchema = new mongoose.Schema({
  name: String,
  nameShortDisplay: String,
  searchName: String,
  apiID: String,
  description: String,
  website: String,
  established: String,
  mailingListUrl: String,
  images: {
    icon: String,
    medium: String,
    large: String
  },
  locations: [
    {
      apiID: String,
      name: String,
      streetAddress: String,
      extendedAddress: String,
      locality: String,
      region: String,
      postalCode: String,
      phone: String,
      website: String,
      hoursOfOperation: String,
      tourInfo: String,
      isPrimary: Boolean,
      inPlanning: Boolean,
      isClosed: Boolean,
      locationTypeDisplay: String,
      country: {
        displayName: String,
        isoCode: String
      },
      yearOpened: String
    }
  ]
});

module.exports = mongoose.model('Brewery', BrewerySchema);
