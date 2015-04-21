define([
  'require',
  'angular',
  'jquery',
  'config',
  'app',
  './routes'
], function (require, ng, $, config) {
  'use strict';

  require(['domReady!'], function (document) {
    ng.bootstrap(document, ['app']);
  });
});
