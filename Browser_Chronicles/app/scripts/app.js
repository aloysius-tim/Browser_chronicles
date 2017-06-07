'use strict';

/**
 * @ngdoc overview
 * @name projetS6App
 * @description
 * # projetS6App
 *
 * Main module of the application.
 */
angular
  .module('projetS6App', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'xml',
    'ngVis',
    'LocalStorageModule',
    'summernote'
  ])
  .config(['localStorageServiceProvider', function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('ls');
  }])
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('xmlHttpInterceptor');
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/story/:storyID/', {
        templateUrl: 'views/story.html',
        controller: 'StoryCtrl',
        controllerAs: 'story'
      })
      .when('/graph', {
        templateUrl: 'views/graph.html',
        controller: 'GraphCtrl',
        controllerAs: 'graph'
      })
      .when('/graph/edit/story/:storyID/:stepID', {
        templateUrl: 'views/editStep.html',
        controller: 'EditStoryCtrl',
        controllerAs: 'editStory'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
