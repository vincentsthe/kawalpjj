var cronJob = require('cron').CronJob;
var updater = require('../crawler/updater');

var cron = {};

cron.updateStatistic = new cronJob("00 00 23 * * *", function () {
    console.log("updating statistic data...");
    updater.updateData(function (status) {
        console.log(status);
    });
}, null, true);

module.exports = cron;