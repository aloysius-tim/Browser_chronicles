'use strict';

/**
 * @ngdoc function
 * @name projetS6App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the projetS6App
 */

var steps, currentStep;

function getStepById(arr, id) {
  for (var d = 0, len = arr.length; d < len; d += 1) {
    if (arr[d]._id === id.toString()) {
      return arr[d];
    }
  }
  return null;
}
function getBegin(arr) {
  return getStepById(arr, 1);
}
String.prototype.levenstein = function(string) {
  var first = this, second = string + "", levenstei = [], i, j;

  if (!(first && second)) return (second || first).length;
  for (i = 0; i <= second.length; levenstei[i] = [i++]);
  for (j = 0; j <= first.length; levenstei[0][j] = j++);

  for (i = 1; i <= second.length; i++) {
    for (j = 1; j <= first.length; j++) {
      levenstei[i][j] = second.charAt(i - 1) == first.charAt(j - 1) ? levenstei[i - 1][j - 1] : levenstei[i][j] = Math.min(levenstei[i - 1][j - 1] + 1,Math.min(levenstei[i][j - 1] + 1, levenstei[i - 1 ][j] + 1))
    }
  }
  return levenstei[second.length][first.length];
};


angular.module('projetS6App')
  .controller('StoryCtrl', function ($scope, $routeParams, $http, serviceAjax, memoryGame, localStorageService, $location, serviceGraph) {
    serviceAjax.getStoriesList().success(function (data) {
      $scope.rootId=$routeParams.storyID;
      var story = serviceAjax.byId(data.stories.story, $routeParams.storyID);
      if(story!==null) {
        serviceAjax.getStory(story._source).success(function (data) {
          steps = data.story.steps.step;
          if(localStorageService.get('currentStep-'+$routeParams.storyID)){
            currentStep = serviceAjax.byId(steps, localStorageService.get('currentStep-'+$routeParams.storyID));
            if (currentStep._type==='end'){
              currentStep = serviceAjax.byId(steps, 1);
            }
          }else{
            currentStep = serviceAjax.byId(steps, 1);
            localStorageService.set('numberOfStep-'+$routeParams.storyID, 1);
          }

          $scope.step = currentStep;

          if (serviceAjax.checkEnd($scope.step)) $scope.end = true;
          else if(serviceAjax.checkMemory($scope.step)) {
            $scope.game = memoryGame.generateNewGame($scope.step);
          }
        });
      }else{
        $scope.error = true;
        $scope.errorMessage = "SO BAD :( - The story you asking for dosen't exist anymore";
      }
    });

    $scope.localStorageService=localStorageService;

    $scope.nextStepId=0;
    $scope.choose = function(id){
      $scope.nextStepId=id;
    };

    $scope.getNextStep = function (nextStepID) {
      nextStepID = typeof nextStepID !== 'undefined' ? nextStepID : $scope.nextStepId;

      currentStep = serviceAjax.byId(steps, nextStepID);
      if (currentStep !== null) {
        $scope.step = currentStep;
      }
      if (serviceAjax.checkEnd($scope.step)){
        $scope.end = true;

        var data = serviceGraph.getJsonVisNetworkGraph(steps);
        var tab = serviceGraph.getShortestPaths(data, steps);

        $scope.minPossible=tab.length;
      }else if(serviceAjax.checkBegin($scope.step)){
        console.log('FUHGJK');
        localStorageService.set('numberOfStep-'+$routeParams.storyID, 0);
      }
      else if(serviceAjax.checkMemory($scope.step)) {
        $scope.game = memoryGame.generateNewGame($scope.step);
      }
      localStorageService.set('numberOfStep-'+$routeParams.storyID, localStorageService.get('numberOfStep-'+$routeParams.storyID)+1);
      $scope.nextStepId=-1;
    };

    $scope.stepxy = function (id) {
      return serviceAjax.byId(steps, id);
    };

    $scope.begin = function (id) {
      console.log('IN');
      localStorageService.remove('currentStep-'+id);
      localStorageService.set('numberOfStep-'+id, 1);
      $location.path('/story/'+id);
    };

    $scope.$watch('value', function (now, old) {
      if ($scope.step) {
        if (now.levenstein($scope.step.riddle.answer)<3&&now.length===$scope.step.riddle.answer.length) {
          $scope.result = 'Good answer' + $scope.step.availablenextsteps.nextstep;
          $scope.getNextStep($scope.step.availablenextsteps.nextstep);
        } else {
          $scope.result = 'Wrong answer';
        }
      }
    });

    $scope.$watch('step', function () {
      if($scope.step)
        localStorageService.set('currentStep-'+$routeParams.storyID, $scope.step._id);
    }, true);

    /*if ($scope.step._type == 'riddle'){
     $scope.answer = $scope.step.riddle.answers;
     }*/
  }).directive('mgCard', function() {
  return {
    restrict: 'E',
    template: '<div class="container">' +
    '<div class="card" ng-hide="card.removed" ng-class="{flipped: card.flipped}">' +
    '<div class="front"></div>' +
    '<div class="back" ><h1>{{card.title}}</h1></div>' +
    '</div>' +
    '</div>',
    scope: {
      tile: '='
    }
  }
});

