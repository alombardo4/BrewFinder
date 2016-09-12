'use strict';

var app = require('../..');
import request from 'supertest';

var newChain;

describe('Chain API:', function() {

  describe('GET /api/chains', function() {
    var Chains;

    beforeEach(function(done) {
      request(app)
        .get('/api/chains')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Chains = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      Chains.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/chains', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/chains')
        .send({
          name: 'New Chain',
          info: 'This is the brand new Chain!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newChain = res.body;
          done();
        });
    });

    it('should respond with the newly created Chain', function() {
      newChain.name.should.equal('New Chain');
      newChain.info.should.equal('This is the brand new Chain!!!');
    });

  });

  describe('GET /api/chains/:id', function() {
    var Chain;

    beforeEach(function(done) {
      request(app)
        .get('/api/chains/' + newChain._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Chain = res.body;
          done();
        });
    });

    afterEach(function() {
      Chain = {};
    });

    it('should respond with the requested Chain', function() {
      Chain.name.should.equal('New Chain');
      Chain.info.should.equal('This is the brand new Chain!!!');
    });

  });

  describe('PUT /api/chains/:id', function() {
    var updatedChain;

    beforeEach(function(done) {
      request(app)
        .put('/api/chains/' + newChain._id)
        .send({
          name: 'Updated Chain',
          info: 'This is the updated Chain!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedChain = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedChain = {};
    });

    it('should respond with the updated Chain', function() {
      updatedChain.name.should.equal('Updated Chain');
      updatedChain.info.should.equal('This is the updated Chain!!!');
    });

  });

  describe('DELETE /api/chains/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/chains/' + newChain._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when Chain does not exist', function(done) {
      request(app)
        .delete('/api/chains/' + newChain._id)
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
