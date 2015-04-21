define([], function () {
  'use strict';

  return {
    endpoint_node: window.location.origin,
    getMeanScoreUrl: '/score/average',
    getMeanSubmissionUrl: '/submission/average',
    getContestantListUrl: '/user',
    getContestantDatalUrl: function (userId) {
      return '/user/' + userId;
    }
  };
});