var driver = require('../utility/driver');
var user = require('../models/user');
var conf = require('../conf');
var timeUtils = require('../utility/timeUtils');

var updater = {};

var addDayProperty = function (submissions, callback) {
  driver.async.each(submissions, function (submission, callback) {
    submission.day = timeUtils.dateToDay(submission.submitted_time);
    callback(null);
  }, function (err) {
    if (err) {
      callback("error");
    } else {
      callback(null);
    }
  });
};

var deleteSubmissionTable = function (callback) {
  driver.appMysqlpool.getConnection(function (err, connection) {
    if (err) {
      callback(err);
      console.log("Database connection error");
    } else {
      var query = "DELETE FROM submission";
      connection.query(query, function (err, row) {
        if(err) {
          callback(err);
        } else {
          callback(null);
        }
      });
    }
  });
};

var deleteScoreTable = function (callback) {
  driver.appMysqlpool.getConnection(function (err, connection) {
    if (err) {
      callback(err);
      console.log("Database connection error");
    } else {
      var query = "DELETE FROM score";
      connection.query(query, function (err, row) {
        if(err) {
          callback(err);
        } else {
          callback(null);
        }
      });
    }
  });
};

var updateSubmissions = function (submissions, callback) {
  driver.async.series([
    function (callback) {
      deleteSubmissionTable(function (err) {
        callback(err);
      });
    },
    function (callback) {
      var dayArray = [];
      for(var i = 0; i <= timeUtils.getCurrentDay(); ++i) {
        dayArray.push(i);
      }

      driver.async.eachSeries(dayArray, function (day, callback) {
        var userSubmissionCount = [];
        for (var i = conf.first_user_id; i <= conf.last_user_id; ++i) {
          userSubmissionCount[i] = 0;
        }
        for (var i = 0; i < submissions.length; ++i) {
          if (submissions[i].day == day) {
            ++userSubmissionCount[submissions[i].submitter_id];
          }
        }

        driver.appMysqlpool.getConnection(function (err, connection) {
          if (err) callback(err);
          var submissionDatas = [];
          for (var i = conf.first_user_id; i <= conf.last_user_id; ++i) {
            submissionDatas.push({
              user_id: i,
              day: day,
              count: userSubmissionCount[i]
            });
          }

          driver.async.each(submissionDatas, function (submissionData, callback) {
            connection.query("INSERT INTO submission SET ?", submissionData, function (err, result) {
              callback(err);
            });
          }, function (err) {
            callback(err);
          });
        });
      }, function (err) {
        callback(err);
      });
    }
  ], function (err) {
    callback(err);
  });
};

var updateScore = function (submissions, callback) {
  driver.async.series([
    function (callback) {
      deleteScoreTable(function (err) {
        callback(err);
      });
    }, function (callback) {
      var dayArray = [];
      for (var i = 0; i <= timeUtils.getCurrentDay(); ++i) {
        dayArray.push(i);
      }

      driver.async.eachSeries(dayArray, function (day, callback) {
        var userSubmissionHighestScore = [];
        for (var i = conf.first_user_id; i <= conf.last_user_id; ++i) {
          userSubmissionHighestScore[i] = {};
        }
        for (var i = 0; i < submissions.length; ++i) {
          if (submissions[i].day <= day) {
            var problemId = submissions[i].problem_id.toString();
            if (problemId in userSubmissionHighestScore[submissions[i].submitter_id]) {
              userSubmissionHighestScore[submissions[i].submitter_id][problemId] = Math.max(submissions[i].score, userSubmissionHighestScore[submissions[i].submitter_id][problemId]);
            } else {
              userSubmissionHighestScore[submissions[i].submitter_id][problemId] = submissions[i].score;
            }
          }
        }

        driver.appMysqlpool.getConnection(function (err, connection) {
          if (err) callback(err);
          var scoreDatas = [];
          for (var i = conf.first_user_id; i <= conf.last_user_id; ++i) {
            var totalScores = 0;
            for (var problem in userSubmissionHighestScore[i]) {
              if (userSubmissionHighestScore[i].hasOwnProperty(problem)) {
                totalScores += userSubmissionHighestScore[i][problem];
              }
            }
            scoreDatas.push({
              user_id: i,
              day: day,
              score: Math.round(totalScores)
            });
          }

          driver.async.each(scoreDatas, function (scoreData, callback) {
            connection.query("INSERT INTO score SET ?", scoreData, function (err, result) {
              callback(err);
            });
          }, function (err) {
            callback(err);
          });
        });
      }, function (err) {
        callback(err);
      });
    }
  ], function (err) {
    callback(err);
  });
};

updater.updateData = function (callback) {
  driver.remoteMysqlpool.getConnection(function (err, connection) {
    if (err) {
      console.log('Remote database connection failed');
      callback({status: "error connecting to database"});
      throw err;
    } else {
      var query = "SELECT submitted_time, submitter_id, contest_id, problem_id, score" +
                  " FROM submissions" +
                  " WHERE contest_id IN (" + conf.contest_id.join(',') + ")" +
                  " AND submitter_id IN (" + user.getAllUsersId().join(',') + ")";
      connection.query(query, function (err, rows) {
        var submissions = rows;
        if (err) {
          callback({status: "error executing query"});
        } else {
          addDayProperty(submissions, function (error) {
            if (error) {
              callback(error);
            } else {
              driver.async.parallel([
                function (callback) {
                  updateSubmissions(submissions, callback);
                },
                function (callback) {
                  updateScore(submissions, callback);
                }
              ], function (err) {
                if (err) {
                  callback(err);
                } else {
                  callback({status: 'OK'});
                }
              });
            }
          });
        }
      });
    }
  });
};

module.exports = updater;