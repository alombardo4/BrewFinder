'use strict';

describe('Component: LocalitiesComponent', function () {

  // load the controller's module
  beforeEach(module('brewfinderwebApp'));

  var LocalitiesComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    LocalitiesComponent = $componentController('LocalitiesComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
