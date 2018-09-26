const BootBot = require('bootbot');
const config = require('./config.js');

const bot = new BootBot({
    accessToken: config['FB_ACCESS_TOKEN'],
    verifyToken: config['FB_VERIFY_TOKEN'],
    appSecret: config['FB_APP_SECRET']
});

bot.say(config['FB_ID_TO_SEND_MESSAGES'], 'Hello World');