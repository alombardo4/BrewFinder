'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var BreweryCtrlStub = {
  index: 'BreweryCtrl.index',
  show: 'BreweryCtrl.show',
  create: 'BreweryCtrl.create',
  update: 'BreweryCtrl.update',
  destroy: 'BreweryCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var BreweryIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './Brewery.controller': BreweryCtrlStub
});

describe('Brewery API Router:', function() {

  it('should return an express router instance', function() {
    BreweryIndex.should.equal(routerStub);
  });

  describe('GET /api/breweries', function() {

    it('should route to Brewery.controller.index', function() {
      routerStub.get
        .withArgs('/', 'BreweryCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/breweries/:id', function() {

    it('should route to Brewery.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'BreweryCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/breweries', function() {

    it('should route to Brewery.controller.create', function() {
      routerStub.post
        .withArgs('/', 'BreweryCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/breweries/:id', function() {

    it('should route to Brewery.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'BreweryCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/breweries/:id', function() {

    it('should route to Brewery.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'BreweryCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/breweries/:id', function() {

    it('should route to Brewery.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'BreweryCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
