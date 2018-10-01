const config = require('../config.js');
const request = require('request');
const fs = require('await-fs');
const syncFs = require('fs');
const messageBot = require('../messageBot.js')
const log = require('../log.js');
const bodyParser = require('body-parser');


const express = require('express');
const app = express();




app.use(bodyParser().json())


app.get('/', (ctx, next) => {
		console.log("request handled");
		//ctx.res.end("GG!");
    res.send(syncFs.readFileSync('./index.html', 'utf8'));
    //next();
});

app.post('/changeSettings', (req, res) => {

    const body = req.body;

    let stringifiedBody = `const config = ${JSON.stringify(body, null, 2)};\nmodule.exports = config;`;

    fs.writeFile("../config.js", stringifiedBody, "utf8", (err, data) => {
        if (err) {
            log(err);
            res.send("FAILED TO CHANGE SETTINGS.");
            messageBot.customMessage({ "err": "FAILED TO CHANGE SETTINGS.", "url": "172.104.211.48:8081" });
            return;
        }
        messageBot.customMessage({ "err": "SETTINGS CHANGED. SERVER RESTARTED", "url": "172.104.211.48:8081" });

        log("SETTINGS CHANGED. SERVER RESTARTED");

        res.send("SETTINGS CHANGED. SERVER RESTARTED");
        return;
    });
});

app.post('/clearDB', (req, res) => {


    fs.writeFile('../adsDB.json', '', 'utf8', (err, data) => {
        if (err) {
            log(err);
            res.send("FAILED TO CLEAR DB.");
            messageBot.customMessage({ "err": "FAILED TO CLEAR DB.", "url": "172.104.211.48:8081" });
            return;
        }
        messageBot.customMessage({ "err": "DB CLEARED", "url": "172.104.211.48:8081" });

        log("DB CLEARED");

        res.send("DB CLEARED");
        
    });

});



app.listen(8081, function () {
	log("GUI SERVER LISTENING ON 8081 PORT")
});
