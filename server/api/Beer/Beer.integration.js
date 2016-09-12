'use strict';

var app = require('../..');
import request from 'supertest';

var newBeer;

describe('Beer API:', function() {

  describe('GET /api/beers', function() {
    var Beers;

    beforeEach(function(done) {
      request(app)
        .get('/api/beers')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Beers = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      Beers.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/beers', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/beers')
        .send({
          name: 'New Beer',
          info: 'This is the brand new Beer!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newBeer = res.body;
          done();
        });
    });

    it('should respond with the newly created Beer', function() {
      newBeer.name.should.equal('New Beer');
      newBeer.info.should.equal('This is the brand new Beer!!!');
    });

  });

  describe('GET /api/beers/:id', function() {
    var Beer;

    beforeEach(function(done) {
      request(app)
        .get('/api/beers/' + newBeer._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Beer = res.body;
          done();
        });
    });

    afterEach(function() {
      Beer = {};
    });

    it('should respond with the requested Beer', function() {
      Beer.name.should.equal('New Beer');
      Beer.info.should.equal('This is the brand new Beer!!!');
    });

  });

  describe('PUT /api/beers/:id', function() {
    var updatedBeer;

    beforeEach(function(done) {
      request(app)
        .put('/api/beers/' + newBeer._id)
        .send({
          name: 'Updated Beer',
          info: 'This is the updated Beer!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedBeer = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedBeer = {};
    });

    it('should respond with the updated Beer', function() {
      updatedBeer.name.should.equal('Updated Beer');
      updatedBeer.info.should.equal('This is the updated Beer!!!');
    });

  });

  describe('DELETE /api/beers/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/beers/' + newBeer._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when Beer does not exist', function(done) {
      request(app)
        .delete('/api/beers/' + newBeer._id)
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
