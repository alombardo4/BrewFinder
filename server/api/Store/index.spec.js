'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var StoreCtrlStub = {
  index: 'StoreCtrl.index',
  show: 'StoreCtrl.show',
  create: 'StoreCtrl.create',
  update: 'StoreCtrl.update',
  destroy: 'StoreCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var StoreIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './Store.controller': StoreCtrlStub
});

describe('Store API Router:', function() {

  it('should return an express router instance', function() {
    StoreIndex.should.equal(routerStub);
  });

  describe('GET /api/stores', function() {

    it('should route to Store.controller.index', function() {
      routerStub.get
        .withArgs('/', 'StoreCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/stores/:id', function() {

    it('should route to Store.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'StoreCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/stores', function() {

    it('should route to Store.controller.create', function() {
      routerStub.post
        .withArgs('/', 'StoreCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/stores/:id', function() {

    it('should route to Store.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'StoreCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/stores/:id', function() {

    it('should route to Store.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'StoreCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/stores/:id', function() {

    it('should route to Store.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'StoreCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
