// First I create an exec command which is executed before current process is killed


module.exports = (pid) => {
    const cmd = "npm run scrapper";

    const exec = require('child_process').exec;

    exec(cmd, function() {
        process.kill(pid);
    });
}