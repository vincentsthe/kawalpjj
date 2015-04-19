var conf = require('./conf');

var driver = {};


var moment = require('moment');
driver.moment = moment;


var async = require('async');
driver.async = async;


var mysql = require('mysql');

var appMysqlpool = mysql.createPool({
  connectionLimit: 100,
  host: conf.appHost,
  user: conf.appDatabaseUser,
  password: conf.appDatabasePassword,
  database: conf.appDatabaseDb,
  debug: false
});

var remoteMysqlpool = mysql.createPool({
  connectionLimit: 100,
  host: conf.remoteHost,
  user: conf.remoteDatabaseUser,
  password: conf.remoteDatabasePassword,
  database: conf.remoteDatabaseDb,
  debug: false
});


module.exports = driver;