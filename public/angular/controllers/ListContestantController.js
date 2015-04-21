define([
  './module',
  'chartDrawer',
  'config',
  'd3'
], function (controllers, chartDrawer, config, d3) {
  'use strict';
  var drawTable = function(finalData) {
    var transitionDuration = 1000;

    var svg = d3.select("#container");

    svg.attr("height", 35*(finalData.length+1));

    var bar = svg.selectAll(".bar")
      .data(finalData, function(d) {return d.lx_id;});

    bar.transition()
      .duration(transitionDuration)
      .attr("transform", function(d, i) {return "translate(0, " + 35*(i+1) + ")";})
      .style("z-index", 10)
      .style("fill-opacity", 1);

    var newBar = bar.enter()
      .append("g")
      .attr("class", "bar")
      .attr("transform", function(d, i) {return "translate(0, " + 35*(i+1) + ")";})
      .style("fill-opacity", 1e-6)
      .style("z-index", 5);



    newBar.transition()
      .duration(2*transitionDuration)
      .style("fill-opacity", 1);

    newBar.append("rect")
      .attr("width", 900)
      .attr("height", 30);

    newBar.append("text")
      .attr("x", 5)
      .attr("y", 15)
      .attr("dy", ".35em")
      .text(function(d) {return d.username;});

    newBar.append("text")
      .attr("x", 120)
      .attr("y", 15)
      .attr("dy", ".35em")
      .text(function(d) {return d.fullname;});

    newBar.append("text")
      .attr("x", 470)
      .attr("y", 15)
      .attr("dy", ".35em")
      .text(function(d) {return d.score;});

    newBar.append("text")
      .attr("x", 620)
      .attr("y", 15)
      .attr("dy", ".35em")
      .text(function(d) {return d.submission;});

    newBar.append("a")
      .attr("dy", ".35em")
      .attr("xlink:href", function(d) {return "#/contestant/view/" + d.lx_id;})
      .append("text")
      .attr("class", "link")
      .attr("x", 770)
      .attr("y", 15)
      .attr("dy", ".35em")
      .text("detail");

    bar.exit()
      .style("z-index", 5)
      .transition()
        .duration(transitionDuration/2)
        .style("fill-opacity", 1e-6)
        .remove();


  };


  var update = function(data, keywords, sortBy, order) {
    var finalData = [];
    var len = data.length;
    for(var i=0 ; i<len ; i++) {
      if((keywords=="") || (data[i].fullname.toLowerCase().indexOf(keywords.toLowerCase()) >= 0)) {
        finalData.push(data[i]);
      }
    }
    finalData.sort(function(n1, n2) {
      if(sortBy=='username') {
        if(order == 'asc') {
          return n1.username.toLowerCase().localeCompare(n2.username.toLowerCase());
        } else {
          return n2.username.toLowerCase().localeCompare(n1.username.toLowerCase());
        }
      } else if(sortBy=='fullname') {
        if(order == 'asc') {
          return n1.fullname.toLowerCase().localeCompare(n2.fullname.toLowerCase());
        } else {
          return n2.fullname.toLowerCase().localeCompare(n1.fullname.toLowerCase());
        }
      } else if(sortBy=='score') {
        if(order == 'asc') {
          return n2.score - n1.score;
        } else {
          return n1.score - n2.score;
        }
      } else {
        if(order == 'asc') {
          return n2.submission - n1.submission;
        } else {
          return n1.submission - n2.submission;
        }
      }
    });
    drawTable(finalData);
  };

  controllers.controller('ListContestantController', ['$scope', '$http', function ($scope, $http) {
    var contestantData;
    $scope.loadSuccess = false;
    $scope.sortBy = "username";
    $scope.order = "asc";
    $scope.keywords = "";

    $scope.goToContestant = function(id) {
      alert(id);
    };

    $scope.changeSortBy = function(header) {
      if($scope.sortBy == header) {
        if($scope.order == "asc") {
          $scope.order = "desc";
        } else {
          $scope.order = "asc";
        }
      } else {
        $scope.sortBy = header;
        $scope.order = "asc";
      }
      update(contestantData, $scope.keywords, $scope.sortBy, $scope.order);
    };

    $http({method: 'GET', url: config.getContestantListUrl}).
      success(function(data) {
        update(data, $scope.keywords, $scope.sortBy, $scope.order);
        contestantData = data;
        $scope.loadSuccess = true;
        $scope.$watch('keywords', function() {
          update(contestantData, $scope.keywords, $scope.sortBy, $scope.order);
        });
      })
  }]);
});