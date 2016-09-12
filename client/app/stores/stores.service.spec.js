'use strict';

describe('Service: stores', function () {

  // load the service's module
  beforeEach(module('brewfinderwebApp'));

  // instantiate service
  var stores;
  beforeEach(inject(function (_stores_) {
    stores = _stores_;
  }));

  it('should do something', function () {
    expect(!!stores).toBe(true);
  });

});
