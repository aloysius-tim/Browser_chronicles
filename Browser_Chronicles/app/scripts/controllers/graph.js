'use strict';

/**
 * @ngdoc function
 * @name projetS6App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the projetS6App
 */
var storiesList;
angular.module('projetS6App')
  .controller('GraphCtrl', function ($scope, $http, $rootScope, $location, serviceAjax, serviceGraph) {
    $scope.pagetitle = 'You must select a story to show it graph :)';
    serviceAjax.getStoriesList().success(function (data) {
      storiesList = data.stories.story;
      $scope.storiesList = storiesList;
    });

    $scope.loadStoryGraph = function (storyID){
      var story = serviceAjax.byId(storiesList, storyID);
      if(story!==null){
        $scope.pagetitle = 'Graph of - '+story.title;
        serviceAjax.getStory(story._source).success(function(data){
          $scope.data = serviceGraph.getJsonVisNetworkGraph(data.story.steps.step);
          $scope.tab = serviceGraph.getShortestPaths($scope.data, data.story.steps.step);
          if($scope.tab.length===0) $scope.tab = "There is no way to win the game :(";
          serviceGraph.colorShortestPath($scope.data, data.story.steps.step);
          $scope.options = serviceGraph.getVisOptions();
          $scope.events = {};
          $scope.events.selectNode = function (object) {
            $rootScope.$apply(function() {
              $location.path('/graph/edit/story/'+story._id+"/"+object.nodes[0]);
            });
          }
        });
      }
      else{
        $scope.error=true;
        $scope.errorMessage = "SO bad :( The story you asking for dosen't exist anymore"
      }
    };
  });
