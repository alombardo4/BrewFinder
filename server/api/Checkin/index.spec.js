'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var CheckinCtrlStub = {
  index: 'CheckinCtrl.index',
  show: 'CheckinCtrl.show',
  create: 'CheckinCtrl.create',
  update: 'CheckinCtrl.update',
  destroy: 'CheckinCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var CheckinIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './Checkin.controller': CheckinCtrlStub
});

describe('Checkin API Router:', function() {

  it('should return an express router instance', function() {
    CheckinIndex.should.equal(routerStub);
  });

  describe('GET /api/checkins', function() {

    it('should route to Checkin.controller.index', function() {
      routerStub.get
        .withArgs('/', 'CheckinCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/checkins/:id', function() {

    it('should route to Checkin.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'CheckinCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/checkins', function() {

    it('should route to Checkin.controller.create', function() {
      routerStub.post
        .withArgs('/', 'CheckinCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/checkins/:id', function() {

    it('should route to Checkin.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'CheckinCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/checkins/:id', function() {

    it('should route to Checkin.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'CheckinCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/checkins/:id', function() {

    it('should route to Checkin.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'CheckinCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
