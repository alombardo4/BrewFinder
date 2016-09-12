'use strict';

describe('Service: follow', function () {

  // load the service's module
  beforeEach(module('brewfinderwebApp'));

  // instantiate service
  var follow;
  beforeEach(inject(function (_follow_) {
    follow = _follow_;
  }));

  it('should do something', function () {
    expect(!!follow).toBe(true);
  });

});
