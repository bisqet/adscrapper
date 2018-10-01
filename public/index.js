const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
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

    await fs.writeFile("../config.js", stringifiedBody, "utf8", (err, data) => {
        if (err) {
            log(err);
            ctx.body = "FAILED TO CHANGE SETTINGS.";
            messageBot.customMessage({ "err": "FAILED TO CHANGE SETTINGS.", "url": "172.104.211.48:8081" });
            return;
        }
        messageBot.customMessage({ "err": "SETTINGS CHANGED. SERVER RESTARTED", "url": "172.104.211.48:8081" });

        log("SETTINGS CHANGED. SERVER RESTARTED");

        ctx.body = "SETTINGS CHANGED. SERVER RESTARTED";
        return;
    });
    return;
});

app.post('/clearDB', (req, res) => {


    await fs.writeFile('../adsDB.json', '', 'utf8', (err, data) => {
        if (err) {
            log(err);
            ctx.body = "FAILED TO CLEAR DB.";
            messageBot.customMessage({ "err": "FAILED TO CLEAR DB.", "url": "172.104.211.48:8081" });
            return;
        }
        messageBot.customMessage({ "err": "DB CLEARED", "url": "172.104.211.48:8081" });

        log("DB CLEARED");

        ctx.body = "DB CLEARED";
        
    });

return;

});



app.listen(8081, function () {
	log("GUI SERVER LISTENING ON 8081 PORT")
});
