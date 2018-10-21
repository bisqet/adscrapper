    const reload = require('require-reload')(require)
    const fs = require('fs');
    const util = require('util');
    const readFile = util.promisify(fs.readFile);
    const deleteFile = util.promisify(fs.unlink);
    const puppeteer = require('puppeteer');
    //const request = require('request');
    const log = require('./log.js');
    const low = require('lowdb');
    let config = reload('./config.js');
    let WARN_CONFIG = reload('./WARN_CONFIG.js');

    const messageBot = require('./messageBot.js')

    messageBot.customMessage({ 'err': 'SCRAPPER STARTED', 'url': 'https://linode.com' });
    log('SCRAPPER STARTED');

    // LowDB init 
    // const FileSync = require('lowdb/adapters/FileSync');
    // const adapter = new FileSync('./.data/db.json');
    // const db = low(adapter);
    // db.defaults({ ads: []})
    // .write();
    const FileSync = require('lowdb/adapters/FileSync');
    const adapterAds = new FileSync('./adsDB.json');
    const adsDB = low(adapterAds);
    adsDB.defaults({ ads: [] })
        .write();

    // functions
    function delay(mseconds) {
        //log('Pausing for', mseconds / 1000, 'seconds...');
        return new Promise(resolve => {
            setTimeout(() => resolve(), mseconds);
        });
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

async function test(){

            const browser = await puppeteer.launch({
                       headless: true,
        ignoreHTTPSErrors: true,
        userDataDir: './tmp',
                args: ['--no-sandbox',
                 '--incognito',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certifcate-errors',
        '--ignore-certifcate-errors-spki-list',
        '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',

                `--proxy-server=98.152.68.30:31438`
                ],
                defaultViewport: {
                    width:  1280,
                    height: 600,
                    deviceScaleFactor: 1,
                    isMobile: false,
                    hasTouch: false,
                    isLandscape: false
                }
            });

            const page = await browser.newPage();

await page.goto('http://www.yad2.co.il/Nadlan/rent_info.php?NadlanID=4cf417113b56b7d8002f30a2736d21a043b')
const content = await page.content()
        fs.writeFileSync('./public/bancheck.html', content, 'utf8');
        const cookies = await page.cookies();

                fs.writeFileSync('./public/cookies.html', JSON.stringify(cookies, null, 2), 'utf8');

}
test();