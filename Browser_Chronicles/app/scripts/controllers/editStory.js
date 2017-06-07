'use strict';

/**
 * @ngdoc function
 * @name projetS6App.controller:EditStoryCtrl
 * @description
 * # MainCtrl
 * Controller of the projetS6App
 */
angular.module('projetS6App')
  .controller('EditStoryCtrl', function ($scope, $http, $routeParams, serviceAjax, $location) {
    serviceAjax.getStoriesList().success(function (data) {
      var story = serviceAjax.byId(data.stories.story, $routeParams.storyID);
      if(story!==null) {
        $scope.story = story;
        console.log(story);
        serviceAjax.getStory(story._source).success(function (data) {
          $scope.step = serviceAjax.byId(data.story.steps.step, $routeParams.stepID);
        })
      }
    });

    $scope.options = {
      height: 300,
      focus: true,
      airMode: false,
      toolbar: [
        ['edit',['undo','redo']],
        ['headline', ['style']],
        ['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
        ['fontface', ['fontname']],
        ['textsize', ['fontsize']],
        ['fontclr', ['color']],
        ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
        ['height', ['height']],
        ['table', ['table']],
        ['view', ['fullscreen', 'codeview']],
        ['insert', ['link','picture','video','hr']]
      ]
    };

    $scope.submit = function () {
      console.log('submit');
      var data={'storyId':$routeParams.storyID, 'stepId':$scope.step._id, 'title':$scope.step.title, 'description':$scope.step.description};
      $http.post('http://localhost:8080/api/story', data).
      success(function(data, status, headers, config) {
        $location.path('/graph');
      }).error(function(data, status, headers, config) {

      });
    };
  });
