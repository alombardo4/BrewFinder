'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var LocalityCtrlStub = {
  index: 'LocalityCtrl.index',
  show: 'LocalityCtrl.show',
  create: 'LocalityCtrl.create',
  update: 'LocalityCtrl.update',
  destroy: 'LocalityCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var LocalityIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './Locality.controller': LocalityCtrlStub
});

describe('Locality API Router:', function() {

  it('should return an express router instance', function() {
    LocalityIndex.should.equal(routerStub);
  });

  describe('GET /api/localities', function() {

    it('should route to Locality.controller.index', function() {
      routerStub.get
        .withArgs('/', 'LocalityCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/localities/:id', function() {

    it('should route to Locality.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'LocalityCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/localities', function() {

    it('should route to Locality.controller.create', function() {
      routerStub.post
        .withArgs('/', 'LocalityCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/localities/:id', function() {

    it('should route to Locality.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'LocalityCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/localities/:id', function() {

    it('should route to Locality.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'LocalityCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/localities/:id', function() {

    it('should route to Locality.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'LocalityCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
