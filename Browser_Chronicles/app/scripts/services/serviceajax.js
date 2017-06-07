'use strict';

/**
 * @ngdoc service
 * @name projetS6App.serviceAjax
 * @description
 * # serviceAjax
 * Factory in the projetS6App.
 */

var defaultPath = '/stories/';
angular.module('projetS6App')
  .factory('serviceAjax', function serviceAjax ($http) {
    return{
      getStoriesList: function () {
        return $http.get('/stories/stories.xml');
      },
      getStory: function(path){
        return $http.get(path);
      },
      /**
       * This function return the step for an id or null if the stepId is not found
       * It's bad practice but for MVP it will work fine.
       * @param arr
       * @param id
       * @returns {*}
       */
      byId: function(arr, id) {
        for (var d = 0, len = arr.length; d < len; d += 1) {
          if (arr[d]._id === id.toString()){
            return arr[d];
          }
        }
        return null;
      },
      checkEnd: function (step) {
        return step._type === 'end';

      },
      checkBegin: function (step) {
        return step._id === '1';

      },
      checkMemory: function (step) {
        return step._type === 'memory';

      }
    }
  });
