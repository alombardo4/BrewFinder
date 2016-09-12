'use strict';

var app = require('../..');
import request from 'supertest';

var newLocality;

describe('Locality API:', function() {

  describe('GET /api/localities', function() {
    var Localitys;

    beforeEach(function(done) {
      request(app)
        .get('/api/localities')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Localitys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      Localitys.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/localities', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/localities')
        .send({
          name: 'New Locality',
          info: 'This is the brand new Locality!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newLocality = res.body;
          done();
        });
    });

    it('should respond with the newly created Locality', function() {
      newLocality.name.should.equal('New Locality');
      newLocality.info.should.equal('This is the brand new Locality!!!');
    });

  });

  describe('GET /api/localities/:id', function() {
    var Locality;

    beforeEach(function(done) {
      request(app)
        .get('/api/localities/' + newLocality._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Locality = res.body;
          done();
        });
    });

    afterEach(function() {
      Locality = {};
    });

    it('should respond with the requested Locality', function() {
      Locality.name.should.equal('New Locality');
      Locality.info.should.equal('This is the brand new Locality!!!');
    });

  });

  describe('PUT /api/localities/:id', function() {
    var updatedLocality;

    beforeEach(function(done) {
      request(app)
        .put('/api/localities/' + newLocality._id)
        .send({
          name: 'Updated Locality',
          info: 'This is the updated Locality!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedLocality = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedLocality = {};
    });

    it('should respond with the updated Locality', function() {
      updatedLocality.name.should.equal('Updated Locality');
      updatedLocality.info.should.equal('This is the updated Locality!!!');
    });

  });

  describe('DELETE /api/localities/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/localities/' + newLocality._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when Locality does not exist', function(done) {
      request(app)
        .delete('/api/localities/' + newLocality._id)
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
