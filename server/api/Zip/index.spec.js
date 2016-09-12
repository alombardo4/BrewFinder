'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var ZipCtrlStub = {
  index: 'ZipCtrl.index',
  show: 'ZipCtrl.show',
  create: 'ZipCtrl.create',
  update: 'ZipCtrl.update',
  destroy: 'ZipCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var ZipIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './Zip.controller': ZipCtrlStub
});

describe('Zip API Router:', function() {

  it('should return an express router instance', function() {
    ZipIndex.should.equal(routerStub);
  });

  describe('GET /api/Zips', function() {

    it('should route to Zip.controller.index', function() {
      routerStub.get
        .withArgs('/', 'ZipCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/Zips/:id', function() {

    it('should route to Zip.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'ZipCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/Zips', function() {

    it('should route to Zip.controller.create', function() {
      routerStub.post
        .withArgs('/', 'ZipCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/Zips/:id', function() {

    it('should route to Zip.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'ZipCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/Zips/:id', function() {

    it('should route to Zip.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'ZipCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/Zips/:id', function() {

    it('should route to Zip.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'ZipCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
