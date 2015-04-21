var driver = require('../utility/driver');

var submissionModel = {};

submissionModel.getSubmissionStatistic = function (callback) {
  driver.appMysqlpool.getConnection(function (err, connection) {
    if (err) {
      throw err;
      console.log('Database connection failed');
    } else {
      var query = "SELECT day, avg(count) AS count " +
                  "FROM  submission " +
                  "GROUP BY day " +
                  "ORDER BY day";

      connection.query(query, function (err, rows) {
        if (err) throw err;
        var submissionArray = [];
        driver.async.each(rows, function (submission, callback) {
          submissionArray[submission.day] = submission.count;
          callback(null);
        }, function (err) {
          if (!err) {
            callback(submissionArray);
          }
        });
      });
    }
  });
};

module.exports = submissionModel;