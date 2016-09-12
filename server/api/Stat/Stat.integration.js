'use strict';

var app = require('../..');
import request from 'supertest';

var newStat;

describe('Stat API:', function() {

  describe('GET /api/Stats', function() {
    var Stats;

    beforeEach(function(done) {
      request(app)
        .get('/api/Stats')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Stats = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      Stats.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/Stats', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/Stats')
        .send({
          name: 'New Stat',
          info: 'This is the brand new Stat!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newStat = res.body;
          done();
        });
    });

    it('should respond with the newly created Stat', function() {
      newStat.name.should.equal('New Stat');
      newStat.info.should.equal('This is the brand new Stat!!!');
    });

  });

  describe('GET /api/Stats/:id', function() {
    var Stat;

    beforeEach(function(done) {
      request(app)
        .get('/api/Stats/' + newStat._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Stat = res.body;
          done();
        });
    });

    afterEach(function() {
      Stat = {};
    });

    it('should respond with the requested Stat', function() {
      Stat.name.should.equal('New Stat');
      Stat.info.should.equal('This is the brand new Stat!!!');
    });

  });

  describe('PUT /api/Stats/:id', function() {
    var updatedStat;

    beforeEach(function(done) {
      request(app)
        .put('/api/Stats/' + newStat._id)
        .send({
          name: 'Updated Stat',
          info: 'This is the updated Stat!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedStat = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedStat = {};
    });

    it('should respond with the updated Stat', function() {
      updatedStat.name.should.equal('Updated Stat');
      updatedStat.info.should.equal('This is the updated Stat!!!');
    });

  });

  describe('DELETE /api/Stats/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/Stats/' + newStat._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when Stat does not exist', function(done) {
      request(app)
        .delete('/api/Stats/' + newStat._id)
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
