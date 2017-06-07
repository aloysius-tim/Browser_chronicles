'use strict';

describe('Controller: RiddleCtrl', function () {

  // load the controller's module
  beforeEach(module('projetS6App'));

  var RiddleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RiddleCtrl = $controller('RiddleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RiddleCtrl.awesomeThings.length).toBe(3);
  });
});
