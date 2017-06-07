'use strict';

var green = "green", blue = "#2196F3", yellow="yellow" , red="red";
function getColorForType(step){
  if(step._type==="end") {
    if (step._win === "false") return red;
    return green;
  }
  return blue;
}

angular.module('projetS6App')
  .factory('serviceGraph', function serviceGraph ($location) {
    return{
      getJsonVisNetworkGraph: function(stepArray) {
        var nodes = [], edges = [];

        stepArray.forEach(function (step) {
          nodes.push({"id": step._id, "label": step._id, "color": getColorForType(step), "shape": "circle", "font": "20px arial white"});
          if (step.availablenextsteps && step.availablenextsteps.nextstep) {
            if(Array.isArray(step.availablenextsteps.nextstep)) {
              step.availablenextsteps.nextstep.forEach(function (nextstep) {
                edges.push({"from": step._id, "to": nextstep, "arrows":"to"});
              });
            }
            else edges.push({"from": step._id, "to": step.availablenextsteps.nextstep, "arrows":"to"});
          }
        });
        return {"nodes": nodes, "edges": edges};
      },
      getVisOptions: function() {
        return {
          autoResize: true,
          height: '600',
          width: '100%',
          layout: {
            randomSeed: undefined,
            improvedLayout:true,
            hierarchical: {
              enabled:true,
              levelSeparation: 120,
              nodeSpacing: 200,
              treeSpacing: 200,
              blockShifting: true,
              edgeMinimization: true,
              parentCentralization: true,
              direction: 'UD',        // UD, DU, LR, RL
              sortMethod: 'directed'   // hubsize, directed
            }
          }
        };
      },
      getShortestPaths: function(jsonVisNetworkGraph, story) {
        var current;
        var paths = [];
        // Looking for smallest ID to get the original point
        jsonVisNetworkGraph.nodes.forEach(function (valeurCourante) {
          paths[valeurCourante.id] = [];
          if (typeof (current) === "undefined"
            || valeurCourante.id < current) {
            current = valeurCourante.id;
          }
        });

        paths[current].push(current);

        var expand = function(currentId) {
          jsonVisNetworkGraph.edges.forEach(function (edge) {
            if (
              (edge.from === currentId
                && paths[edge.to].indexOf(edge.to) < 0)
              ||
              (edge.from === currentId
                && paths[edge.to].length > paths[edge.from].length + 1)
            ) {
              // [].concat() To duplicate values instead of references
              paths[edge.to] = [].concat(paths[edge.from]);
              paths[edge.to].push(edge.to);
              expand(edge.to);
            }
          });
        };
        expand(current);
        var winner = [];
        story.forEach(function (step) {
          if (step._type === "end" && step._win === "true")  {
           winner = paths[step._id]; 
          }
        });
        return winner;
      },
      colorShortestPath: function(data, stories){
        var shortestPath = this.getShortestPaths(data, stories);
        console.log(shortestPath);
        if(shortestPath.length==0) return null;
        for(var i=0; i<(shortestPath.length-1); i++) {
          data.edges.forEach(function (edge) {
            if (edge.from === shortestPath[i] && edge.to === shortestPath[i+1]) {
              edge.color = "green";
              edge.width = 4;
            }
          });
        }

        console.log(data);
        return data;
      }
    }
  });
