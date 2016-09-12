'use strict';

describe('Service: checkins', function () {

  // load the service's module
  beforeEach(module('brewfinderwebApp'));

  // instantiate service
  var checkins;
  beforeEach(inject(function (_checkins_) {
    checkins = _checkins_;
  }));

  it('should do something', function () {
    expect(!!checkins).toBe(true);
  });

});
