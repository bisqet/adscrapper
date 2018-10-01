
module.exports = (pid) => {
    const cmd = "ps";

    const exec = require('child_process').exec;

    exec(cmd, function() {
    	exec(`kill ${pid}`, function() {
    		
    	});
    });
}