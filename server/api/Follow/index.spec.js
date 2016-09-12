'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var FollowCtrlStub = {
  index: 'FollowCtrl.index',
  show: 'FollowCtrl.show',
  create: 'FollowCtrl.create',
  update: 'FollowCtrl.update',
  destroy: 'FollowCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var FollowIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './Follow.controller': FollowCtrlStub
});

describe('Follow API Router:', function() {

  it('should return an express router instance', function() {
    FollowIndex.should.equal(routerStub);
  });

  describe('GET /api/follows', function() {

    it('should route to Follow.controller.index', function() {
      routerStub.get
        .withArgs('/', 'FollowCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/follows/:id', function() {

    it('should route to Follow.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'FollowCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/follows', function() {

    it('should route to Follow.controller.create', function() {
      routerStub.post
        .withArgs('/', 'FollowCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/follows/:id', function() {

    it('should route to Follow.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'FollowCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/follows/:id', function() {

    it('should route to Follow.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'FollowCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/follows/:id', function() {

    it('should route to Follow.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'FollowCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
