'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var BeerCtrlStub = {
  index: 'BeerCtrl.index',
  show: 'BeerCtrl.show',
  create: 'BeerCtrl.create',
  update: 'BeerCtrl.update',
  destroy: 'BeerCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var BeerIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './Beer.controller': BeerCtrlStub
});

describe('Beer API Router:', function() {

  it('should return an express router instance', function() {
    BeerIndex.should.equal(routerStub);
  });

  describe('GET /api/beers', function() {

    it('should route to Beer.controller.index', function() {
      routerStub.get
        .withArgs('/', 'BeerCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/beers/:id', function() {

    it('should route to Beer.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'BeerCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/beers', function() {

    it('should route to Beer.controller.create', function() {
      routerStub.post
        .withArgs('/', 'BeerCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/beers/:id', function() {

    it('should route to Beer.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'BeerCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/beers/:id', function() {

    it('should route to Beer.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'BeerCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/beers/:id', function() {

    it('should route to Beer.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'BeerCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
