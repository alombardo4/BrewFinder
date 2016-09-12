'use strict';

describe('Service: userprofiles', function () {

  // load the service's module
  beforeEach(module('brewfinderwebApp'));

  // instantiate service
  var userprofiles;
  beforeEach(inject(function (_userprofiles_) {
    userprofiles = _userprofiles_;
  }));

  it('should do something', function () {
    expect(!!userprofiles).toBe(true);
  });

});
