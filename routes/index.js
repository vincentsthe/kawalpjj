var express = require('express');
var router = express.Router();
var user = require('../models/user');
var submission = require('../models/submission');
var score = require('../models/score');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/score/average', function (req, res, next) {
  score.getScoreStatistic(function (scoreAverage) {
    res.json(scoreAverage);
  });
});

router.get('/submission/average', function (req, res, next) {
  submission.getSubmissionStatistic(function (submissionAverage) {
    res.json(submissionAverage);
  });
});

router.get('/user/:userId', function (req, res, next) {
  var userId = req.params.userId;
  user.getUserStatistic(userId, function (userStatistic) {
    res.json(userStatistic);
  });
});

router.get('/user', function (req, res, next) {
  user.getAllUserLastInfo(function (userData) {
    res.json(userData);
  });
});

module.exports = router;
