'use strict';

var app = require('../..');
import request from 'supertest';

var newStore;

describe('Store API:', function() {

  describe('GET /api/stores', function() {
    var Stores;

    beforeEach(function(done) {
      request(app)
        .get('/api/stores')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Stores = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      Stores.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/stores', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/stores')
        .send({
          name: 'New Store',
          info: 'This is the brand new Store!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newStore = res.body;
          done();
        });
    });

    it('should respond with the newly created Store', function() {
      newStore.name.should.equal('New Store');
      newStore.info.should.equal('This is the brand new Store!!!');
    });

  });

  describe('GET /api/stores/:id', function() {
    var Store;

    beforeEach(function(done) {
      request(app)
        .get('/api/stores/' + newStore._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Store = res.body;
          done();
        });
    });

    afterEach(function() {
      Store = {};
    });

    it('should respond with the requested Store', function() {
      Store.name.should.equal('New Store');
      Store.info.should.equal('This is the brand new Store!!!');
    });

  });

  describe('PUT /api/stores/:id', function() {
    var updatedStore;

    beforeEach(function(done) {
      request(app)
        .put('/api/stores/' + newStore._id)
        .send({
          name: 'Updated Store',
          info: 'This is the updated Store!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedStore = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedStore = {};
    });

    it('should respond with the updated Store', function() {
      updatedStore.name.should.equal('Updated Store');
      updatedStore.info.should.equal('This is the updated Store!!!');
    });

  });

  describe('DELETE /api/stores/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/stores/' + newStore._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when Store does not exist', function(done) {
      request(app)
        .delete('/api/stores/' + newStore._id)
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
