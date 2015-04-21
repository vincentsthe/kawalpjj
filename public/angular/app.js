define([
  'angular',
  'angularUiRouter',
  './controllers/index'
], function (ng) {
  'use strict';

  var mainModule = ng.module('app', [
    'ui.router',
    'app.controllers'
  ]);

  return mainModule;
});