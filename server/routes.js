/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {
  // Insert routes below
  app.use('/api/Stats', require('./api/Stat'));
  app.use('/api/localities', require('./api/Locality'));
  app.use('/api/Zips', require('./api/Zip'));
  app.use('/api/Search', require('./api/Search'));
  app.use('/api/BreweryDBAPI', require('./api/BreweryDBAPI'));
  app.use('/api/follows', require('./api/Follow'));
  app.use('/api/checkins', require('./api/Checkin'));
  app.use('/api/stores', require('./api/Store'));
  app.use('/api/chains', require('./api/Chain'));
  app.use('/api/beers', require('./api/Beer'));
  app.use('/api/breweries', require('./api/Brewery'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
}
