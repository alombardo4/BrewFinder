'use strict';

var app = require('../..');
import request from 'supertest';

var newBrewery;

describe('Brewery API:', function() {

  describe('GET /api/breweries', function() {
    var Brewerys;

    beforeEach(function(done) {
      request(app)
        .get('/api/breweries')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Brewerys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      Brewerys.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/breweries', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/breweries')
        .send({
          name: 'New Brewery',
          info: 'This is the brand new Brewery!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newBrewery = res.body;
          done();
        });
    });

    it('should respond with the newly created Brewery', function() {
      newBrewery.name.should.equal('New Brewery');
      newBrewery.info.should.equal('This is the brand new Brewery!!!');
    });

  });

  describe('GET /api/breweries/:id', function() {
    var Brewery;

    beforeEach(function(done) {
      request(app)
        .get('/api/breweries/' + newBrewery._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Brewery = res.body;
          done();
        });
    });

    afterEach(function() {
      Brewery = {};
    });

    it('should respond with the requested Brewery', function() {
      Brewery.name.should.equal('New Brewery');
      Brewery.info.should.equal('This is the brand new Brewery!!!');
    });

  });

  describe('PUT /api/breweries/:id', function() {
    var updatedBrewery;

    beforeEach(function(done) {
      request(app)
        .put('/api/breweries/' + newBrewery._id)
        .send({
          name: 'Updated Brewery',
          info: 'This is the updated Brewery!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedBrewery = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedBrewery = {};
    });

    it('should respond with the updated Brewery', function() {
      updatedBrewery.name.should.equal('Updated Brewery');
      updatedBrewery.info.should.equal('This is the updated Brewery!!!');
    });

  });

  describe('DELETE /api/breweries/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/breweries/' + newBrewery._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when Brewery does not exist', function(done) {
      request(app)
        .delete('/api/breweries/' + newBrewery._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
