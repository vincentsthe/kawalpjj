define(['./app'], function (app) {
  'use strict';
  return app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: '/angular/partials/home.html',
        controller: 'HomeController'
      })
      .state('contestant-list', {
        url: '/contestant/list',
        templateUrl: '/angular/partials/listContestant.html',
        controller: 'ListContestantController'
      })
      .state('view-contestant', {
        url: '/contestant/view/:id',
        templateUrl: '/angular/partials/detail.html',
        controller: 'DetailController'
      });
  });
});