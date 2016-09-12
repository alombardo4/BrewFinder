'use strict';

describe('Service: localities', function () {

  // load the service's module
  beforeEach(module('brewfinderwebApp'));

  // instantiate service
  var localities;
  beforeEach(inject(function (_localities_) {
    localities = _localities_;
  }));

  it('should do something', function () {
    expect(!!localities).toBe(true);
  });

});
