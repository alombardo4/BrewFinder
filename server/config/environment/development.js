'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/brewfinderweb-dev'
  },

  // Seed database on startup
  seedDB: true,
  runSearchNames: false

};
