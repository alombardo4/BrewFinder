'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var StatCtrlStub = {
  index: 'StatCtrl.index',
  show: 'StatCtrl.show',
  create: 'StatCtrl.create',
  update: 'StatCtrl.update',
  destroy: 'StatCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var StatIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './Stat.controller': StatCtrlStub
});

describe('Stat API Router:', function() {

  it('should return an express router instance', function() {
    StatIndex.should.equal(routerStub);
  });

  describe('GET /api/Stats', function() {

    it('should route to Stat.controller.index', function() {
      routerStub.get
        .withArgs('/', 'StatCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/Stats/:id', function() {

    it('should route to Stat.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'StatCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/Stats', function() {

    it('should route to Stat.controller.create', function() {
      routerStub.post
        .withArgs('/', 'StatCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/Stats/:id', function() {

    it('should route to Stat.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'StatCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/Stats/:id', function() {

    it('should route to Stat.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'StatCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/Stats/:id', function() {

    it('should route to Stat.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'StatCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
