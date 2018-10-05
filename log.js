const low = require('lowdb');


const FileSync = require('lowdb/adapters/FileSync');

const adapterLogs = new FileSync('./.data/logsDB.json');
const logsDB = low(adapterLogs);
logsDB.defaults({ logs: [] })
    .write();

// console + logsDB logging
module.exports = function log() {
    const text = Array.prototype.join.call(arguments, ' ');
    console.log(text);
    logsDB.get('logs')
        .push(yyyy_mm_dd_hh_mm_ss() + ' - ' + text)
        .write();
};

function yyyy_mm_dd_hh_mm_ss () {
  now = new Date();
  year = "" + now.getFullYear();
  month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
  day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
  hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
  minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
  second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
  return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}