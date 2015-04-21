define([
  './module',
  'chartDrawer',
  'config'
], function (controllers, chartDrawer, config) {
  'use strict';
  controllers.controller('DetailController', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
    $scope.loadSuccess = false;
    var contestantId = $stateParams.id;
    $http({method: "GET", url: config.getContestantDatalUrl(contestantId)})
      .success(function(userData) {
        $scope.username = userData.username;
        $scope.fullname = userData.fullname;
        chartDrawer.drawLineChart("score", userData.score, "Skor", "Hari");
        chartDrawer.drawLineChart("submission", userData.submission, "Submission", "Hari");
        $scope.loadSuccess = true;
      });
  }]);
});