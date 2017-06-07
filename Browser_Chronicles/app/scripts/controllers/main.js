'use strict';

/**
 * @ngdoc function
 * @name projetS6App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the projetS6App
 */
angular.module('projetS6App')
  .controller('MainCtrl', function ($scope, $location, serviceAjax, localStorageService) {
    serviceAjax.getStoriesList().success(function (data) {
      $scope.storiesList = data.stories.story;
      var story1 = serviceAjax.byId(data.stories.story, 1);
      console.log("stories: "+$scope.storiesList);
      $scope.story = {
        'title': story1.title,
        'summary': story1.summary
      };
      $scope.localStorageService=localStorageService;
    });

    $scope.loadStory = function (storyID) {
      var link = '/story/1';
      $location.path(link);
    };

  });
