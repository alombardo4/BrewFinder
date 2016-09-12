'use strict';

var app = require('../..');
import request from 'supertest';

var newFollow;

describe('Follow API:', function() {

  describe('GET /api/follows', function() {
    var Follows;

    beforeEach(function(done) {
      request(app)
        .get('/api/follows')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Follows = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      Follows.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/follows', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/follows')
        .send({
          name: 'New Follow',
          info: 'This is the brand new Follow!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newFollow = res.body;
          done();
        });
    });

    it('should respond with the newly created Follow', function() {
      newFollow.name.should.equal('New Follow');
      newFollow.info.should.equal('This is the brand new Follow!!!');
    });

  });

  describe('GET /api/follows/:id', function() {
    var Follow;

    beforeEach(function(done) {
      request(app)
        .get('/api/follows/' + newFollow._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Follow = res.body;
          done();
        });
    });

    afterEach(function() {
      Follow = {};
    });

    it('should respond with the requested Follow', function() {
      Follow.name.should.equal('New Follow');
      Follow.info.should.equal('This is the brand new Follow!!!');
    });

  });

  describe('PUT /api/follows/:id', function() {
    var updatedFollow;

    beforeEach(function(done) {
      request(app)
        .put('/api/follows/' + newFollow._id)
        .send({
          name: 'Updated Follow',
          info: 'This is the updated Follow!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedFollow = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedFollow = {};
    });

    it('should respond with the updated Follow', function() {
      updatedFollow.name.should.equal('Updated Follow');
      updatedFollow.info.should.equal('This is the updated Follow!!!');
    });

  });

  describe('DELETE /api/follows/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/follows/' + newFollow._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when Follow does not exist', function(done) {
      request(app)
        .delete('/api/follows/' + newFollow._id)
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
