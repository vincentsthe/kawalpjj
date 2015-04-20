var moment = require('moment');
var conf = require('./conf');

var timeUtils = {};

timeUtils.dateToDay = function (date) {
  var momentDate = moment(date);
  var momentBegin = moment(conf.begin_date, "YYYY-MM-DD");
  return momentDate.diff(momentBegin, 'days');
};

timeUtils.getCurrentDay = function () {
  var momentNow = moment();
  var momentBegin = moment(conf.begin_date, "YYYY-MM-DD");
  return momentNow.diff(momentBegin, 'days');
};

module.exports = timeUtils;