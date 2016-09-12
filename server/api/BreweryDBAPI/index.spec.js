'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var BreweryDBAPICtrlStub = {
  index: 'BreweryDBAPICtrl.index',
  show: 'BreweryDBAPICtrl.show',
  create: 'BreweryDBAPICtrl.create',
  update: 'BreweryDBAPICtrl.update',
  destroy: 'BreweryDBAPICtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var BreweryDBAPIIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './BreweryDBAPI.controller': BreweryDBAPICtrlStub
});

describe('BreweryDBAPI API Router:', function() {

  it('should return an express router instance', function() {
    BreweryDBAPIIndex.should.equal(routerStub);
  });

  describe('GET /api/BreweryDBAPIs', function() {

    it('should route to BreweryDBAPI.controller.index', function() {
      routerStub.get
        .withArgs('/', 'BreweryDBAPICtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/BreweryDBAPIs/:id', function() {

    it('should route to BreweryDBAPI.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'BreweryDBAPICtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/BreweryDBAPIs', function() {

    it('should route to BreweryDBAPI.controller.create', function() {
      routerStub.post
        .withArgs('/', 'BreweryDBAPICtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/BreweryDBAPIs/:id', function() {

    it('should route to BreweryDBAPI.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'BreweryDBAPICtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/BreweryDBAPIs/:id', function() {

    it('should route to BreweryDBAPI.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'BreweryDBAPICtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/BreweryDBAPIs/:id', function() {

    it('should route to BreweryDBAPI.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'BreweryDBAPICtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
