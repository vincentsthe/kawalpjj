define([
  './module',
  'chartDrawer',
  'config'
], function (controllers, chartDrawer, config) {
  'use strict';
  controllers.controller('HomeController', ['$scope', '$http', function ($scope, $http) {
    $scope.loadSuccess = false;
    $http({method: 'GET', url: config.getMeanScoreUrl}).
      success(function(data) {
        chartDrawer.drawLineChart("score", data, "Skor", "Hari");
        $http({method: 'GET', url: config.getMeanSubmissionUrl}).
          success(function(data) {
            chartDrawer.drawLineChart("submission", data, "Submission", "Hari");
            $scope.loadSuccess = true;
          });
      });
  }]);
});