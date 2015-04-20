var driver = require('../driver');

var userModel = {};

userModel.fillUserScore = function(user, callback) {
  driver.appMysqlpool.getConnection(function (err, connection) {
    if (err) {
      throw err;
      console.log('Database connection failed');
    } else {
      var query = "SELECT day, score " +
                  "FROM score " +
                  "WHERE user_id = " + user.lx_id + " " +
                  "ORDER BY day";
      connection.query(query, function (err, rows) {
        if (err) callback(err);
        user.score = [];

        driver.async.each(rows, function (score, callback) {
          user.score[score.day] = score.score;
          callback(null);
        }, function (err) {
          if (!err) {
            callback();
          }
        });
      });
    }
  });
}

userModel.fillUserSubmission = function(user, callback) {
  driver.appMysqlpool.getConnection(function (err, connection) {
    if (err) {
      throw err;
      console.log('Database connection failed');
    } else {
      var query = "SELECT day, count " +
                  "FROM submission " +
                  "WHERE user_id = " + user.lx_id + " " +
                  "ORDER BY day";
      connection.query(query, function (err, rows) {
        if (err) callback(err);
        user.submission = [];

        driver.async.each(rows, function (submission, callback) {
          user.submission[submission.day] = submission.count;
          callback(null);
        }, function (err) {
          if (!err) {
            callback();
          }
        });
      });
    }
  });
}

userModel.getUserStatistic = function (userId, callback) {
  driver.appMysqlpool.getConnection(function (err, connection) {
    if (err) {
      throw err;
      console.log('Database connection failed');
    } else {
      var query = "SELECT * " +
                  "FROM user " +
                  "WHERE lx_id = " + userId;
      connection.query(query, function (err, rows) {
        if (err) throw err;
        if (rows.length > 0) {
          var user = rows[0];

          driver.async.parallel([
            function (callback) {
              userModel.fillUserScore(user, function () {
                callback(null);
              });
            }, function (callback) {
              userModel.fillUserSubmission(user, function () {
                callback(null);
              });
            }
          ], function (err) {
            if (err) throw err;
            console.dir(user);
            callback(user);
          });
        } else {
          callback({});
        }
      });
    }
  });
};

userModel.getAllUserLastInfo = function (callback) {
  driver.appMysqlpool.getConnection(function (err, connection) {
    if (err) {
      throw err;
      console.log("Database connection failed");
    } else {
      var query = "SELECT u.lx_id, u.username, u.fullname, max(sc.score) AS score, max(s.count) AS submission " +
                  "FROM user u " +
                  "JOIN score sc ON sc.user_id = u.lx_id " +
                  "JOIN submission s ON s.user_id = u.lx_id " +
                  "GROUP BY u.lx_id " +
                  "ORDER BY u.lx_id";

      connection.query(query, function (err, rows) {
        if (err) throw err;
        callback(rows);
      });
    }
  });
};

module.exports = userModel;