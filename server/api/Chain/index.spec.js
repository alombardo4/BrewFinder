'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var ChainCtrlStub = {
  index: 'ChainCtrl.index',
  show: 'ChainCtrl.show',
  create: 'ChainCtrl.create',
  update: 'ChainCtrl.update',
  destroy: 'ChainCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var ChainIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './Chain.controller': ChainCtrlStub
});

describe('Chain API Router:', function() {

  it('should return an express router instance', function() {
    ChainIndex.should.equal(routerStub);
  });

  describe('GET /api/chains', function() {

    it('should route to Chain.controller.index', function() {
      routerStub.get
        .withArgs('/', 'ChainCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/chains/:id', function() {

    it('should route to Chain.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'ChainCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/chains', function() {

    it('should route to Chain.controller.create', function() {
      routerStub.post
        .withArgs('/', 'ChainCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/chains/:id', function() {

    it('should route to Chain.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'ChainCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/chains/:id', function() {

    it('should route to Chain.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'ChainCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/chains/:id', function() {

    it('should route to Chain.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'ChainCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
