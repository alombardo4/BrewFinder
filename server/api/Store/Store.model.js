'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var StoreSchema = new mongoose.Schema({
  name: String,
  description: String,
  website: String,
  phone: String,
  gmapsUrl: String,
  address: String,
  location: {
    postalCode: String
  },
  gplaceId: String
});
module.exports = mongoose.model('Store', StoreSchema);
