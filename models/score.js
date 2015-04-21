var driver = require('../utility/driver');

var scoreModel = {};

scoreModel.getScoreStatistic = function (callback) {
  driver.appMysqlpool.getConnection(function (err, connection) {
    if (err) {
      throw err;
      console.log('Database connection failed');
    } else {
      var query = "SELECT day, avg(score) AS score " +
                  "FROM  score " +
                  "GROUP BY day " +
                  "ORDER BY day";

      connection.query(query, function (err, rows) {
        if (err) throw err;
        var scoreArray = [];
        driver.async.each(rows, function (score, callback) {
          scoreArray[score.day] = score.score;
          callback(null);
        }, function (err) {
          if (!err) {
            callback(scoreArray);
          }
        });
      });
    }
  });
};

module.exports = scoreModel;