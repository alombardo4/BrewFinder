'use strict';

describe('Controller: CheckinsCtrl', function () {

  // load the controller's module
  beforeEach(module('brewfinderwebApp'));

  var CheckinsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CheckinsCtrl = $controller('CheckinsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
