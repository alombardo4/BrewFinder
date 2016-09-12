'use strict';

describe('Service: breweries', function () {

  // load the service's module
  beforeEach(module('brewfinderwebApp'));

  // instantiate service
  var breweries;
  beforeEach(inject(function (_breweries_) {
    breweries = _breweries_;
  }));

  it('should do something', function () {
    expect(!!breweries).toBe(true);
  });

});
