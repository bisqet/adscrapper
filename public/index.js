const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const config = require('../config.js');
const request = require('request');
const fs = require('await-fs');
const syncFs = require('fs');
const messageBot = require('../messageBot.js')
const log = require('../log.js');




const app = new Koa();
const router = new Router();



router.get('/*', (ctx, next) => {
		console.log("request handled");
		console.log(ctx)
		ctx.res.body = 'Hello World!';
    //ctx.body = syncFs.readFileSync('./index.html', 'utf8');
    //next();
});

/*router.post('/changeSettings', async (ctx, next) => {

    const body = ctx.request.body;

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

router.post('/resetDB', async (ctx, next) => {


    await fs.writeFile('../adsDN.json', '', 'utf8', (err, data) => {
        if (err) {
            log(err);
            ctx.body = "FAILED TO CLEAN DB.";
            messageBot.customMessage({ "err": "FAILED TO CLEAN DB.", "url": "172.104.211.48:8081" });
            return;
        }
        messageBot.customMessage({ "err": "DB CLEANED", "url": "172.104.211.48:8081" });

        log("DB CLEANED");

        ctx.body = "DB CLEANED";
        
    });

return;

});*/

app.use(bodyParser())
	.use(router.routes())
  .use(router.allowedMethods());

app.listen(8081);

log("GUI SERVER LISTENING ON 8081 PORT")