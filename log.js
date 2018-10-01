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
        .push(Date() + ' - ' + text)
        .write();
};
