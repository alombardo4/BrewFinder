'use strict';

var app = require('../..');
import request from 'supertest';

var newZip;

describe('Zip API:', function() {

  describe('GET /api/Zips', function() {
    var Zips;

    beforeEach(function(done) {
      request(app)
        .get('/api/Zips')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Zips = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      Zips.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/Zips', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/Zips')
        .send({
          name: 'New Zip',
          info: 'This is the brand new Zip!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newZip = res.body;
          done();
        });
    });

    it('should respond with the newly created Zip', function() {
      newZip.name.should.equal('New Zip');
      newZip.info.should.equal('This is the brand new Zip!!!');
    });

  });

  describe('GET /api/Zips/:id', function() {
    var Zip;

    beforeEach(function(done) {
      request(app)
        .get('/api/Zips/' + newZip._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Zip = res.body;
          done();
        });
    });

    afterEach(function() {
      Zip = {};
    });

    it('should respond with the requested Zip', function() {
      Zip.name.should.equal('New Zip');
      Zip.info.should.equal('This is the brand new Zip!!!');
    });

  });

  describe('PUT /api/Zips/:id', function() {
    var updatedZip;

    beforeEach(function(done) {
      request(app)
        .put('/api/Zips/' + newZip._id)
        .send({
          name: 'Updated Zip',
          info: 'This is the updated Zip!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedZip = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedZip = {};
    });

    it('should respond with the updated Zip', function() {
      updatedZip.name.should.equal('Updated Zip');
      updatedZip.info.should.equal('This is the updated Zip!!!');
    });

  });

  describe('DELETE /api/Zips/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/Zips/' + newZip._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when Zip does not exist', function(done) {
      request(app)
        .delete('/api/Zips/' + newZip._id)
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
