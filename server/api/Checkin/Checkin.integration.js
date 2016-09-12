'use strict';

var app = require('../..');
import request from 'supertest';

var newCheckin;

describe('Checkin API:', function() {

  describe('GET /api/checkins', function() {
    var Checkins;

    beforeEach(function(done) {
      request(app)
        .get('/api/checkins')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Checkins = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      Checkins.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/checkins', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/checkins')
        .send({
          name: 'New Checkin',
          info: 'This is the brand new Checkin!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newCheckin = res.body;
          done();
        });
    });

    it('should respond with the newly created Checkin', function() {
      newCheckin.name.should.equal('New Checkin');
      newCheckin.info.should.equal('This is the brand new Checkin!!!');
    });

  });

  describe('GET /api/checkins/:id', function() {
    var Checkin;

    beforeEach(function(done) {
      request(app)
        .get('/api/checkins/' + newCheckin._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Checkin = res.body;
          done();
        });
    });

    afterEach(function() {
      Checkin = {};
    });

    it('should respond with the requested Checkin', function() {
      Checkin.name.should.equal('New Checkin');
      Checkin.info.should.equal('This is the brand new Checkin!!!');
    });

  });

  describe('PUT /api/checkins/:id', function() {
    var updatedCheckin;

    beforeEach(function(done) {
      request(app)
        .put('/api/checkins/' + newCheckin._id)
        .send({
          name: 'Updated Checkin',
          info: 'This is the updated Checkin!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedCheckin = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCheckin = {};
    });

    it('should respond with the updated Checkin', function() {
      updatedCheckin.name.should.equal('Updated Checkin');
      updatedCheckin.info.should.equal('This is the updated Checkin!!!');
    });

  });

  describe('DELETE /api/checkins/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/checkins/' + newCheckin._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when Checkin does not exist', function(done) {
      request(app)
        .delete('/api/checkins/' + newCheckin._id)
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
