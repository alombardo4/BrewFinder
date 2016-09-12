'use strict';

describe('Controller: BreweriesCtrl', function () {

  // load the controller's module
  beforeEach(module('brewfinderwebApp'));

  var BreweriesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BreweriesCtrl = $controller('BreweriesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
