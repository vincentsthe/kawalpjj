var driver = require('../driver');
var user = require('../models/user');

var userRetriever = {};

var deleteUserTable = function (callback) {
  driver.appMysqlpool.getConnection(function (err, connection) {
    if (err) {
      callback(err);
      console.log("Database connection error");
    } else {
      var query = "DELETE FROM user";
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

var insertToDb = function (userDatas, callback) {
  driver,appMysqlpool.getConnection(function (err, connection) {
    if (err) {
      callback({status: err});
      throw err;
    } else {
      driver.async.series([
        function (callback) {
          deleteUserTable(callback);
        }, function (callback) {
          driver.async.each(userDatas, function (userData, callback) {
            connection.query("INSERT INTO user SET ?", scoreData, function (err, result) {
              callback(err);
            });
          }, function (err) {
            callback(err);
          });
        }
      ], function (err) {
        callback(err);
      });
    }
  });
};

userRetriever.fetchUser = function (callback) {
  driver.remoteMysqlpool.getConnection(function (err, connection) {
    if (err) {
      callback({status: 'error'});
      throw err;
    } else {
      var query = "SELECT id AS lx_id, username, full_name" +
                  " FROM users" +
                  " WHERE id IN (" + user.getAllUsersId().join(',') + ")";
      connection.query(query, function (err, rows) {
        if (err) {
          callback({status: 'failed to execute remote query'});
          throw err;
        } else {
          insertToDb(rows, function (status) {
            callback(status);
          });
        }
      });
    }
  });
};

module.exports = userRetriever;