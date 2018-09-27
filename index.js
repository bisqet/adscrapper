const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const deleteFile = util.promisify(fs.unlink);
const puppeteer = require('puppeteer');
const request = require('request');
const low = require('lowdb');
const config = require('./config.js');



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
const adapterLogs = new FileSync('./.data/logsDB.json');
const logsDB = low(adapterLogs);
logsDB.defaults({ logs: [] })
    .write();

// console + logsDB logging
function log() {
    const text = Array.prototype.join.call(arguments, ' ');
    console.log(text);
    logsDB.get('logs')
        .push(Date() + ' - ' + text)
        .write();
};

// functions
function delay(mseconds) {
    log('Pausing for', mseconds / 1000, 'seconds...');
    return new Promise(resolve => {
        setTimeout(() => resolve(), mseconds);
    });
}

const parseDataUrl = (dataUrl) => {
    const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (matches.length !== 3) {
        throw new Error('Could not parse data URL.');
    }
    return { mime: matches[1], buffer: Buffer.from(matches[2], 'base64') };
};

const waitForCaptchaInput = () => {
    return new Promise((resolve, reject) => {
        setTimeout(async() => {
            if (fs.existsSync('./captcha.txt')) {
                log('found captcha');
                const solution = await readFile('./captcha.txt', "utf8");
                await deleteFile('./captcha.txt');
                log('delete captch and resolving..');
                return resolve(solution);
            }
            reject('no captcha solution file found');

        }, 30000); // two minutes
    });
}

const publicFolder = './public/';
// north tlv 3.5 - 4.5 from 6000 - 8500 with parking and elevator
const main = (async(yad2ResultsURL) => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(120000 * 2);
    await page.goto(yad2ResultsURL);
    await page.waitFor(10000);
    await page.screenshot({ path: publicFolder + 'searchResultsx.png' });
    log('search results page loaded');

    // check for captcha
    const searchSource = await page.content();
    if (searchSource.indexOf('Are you human?') > -1) {
        // get the image
        const captchaImg = await page.evaluate(() => document.querySelector('#captchaImageInline').src);
        const { buffer } = parseDataUrl(captchaImg);
        fs.writeFileSync(publicFolder + 'captcha.png', buffer, 'base64');
        log('saved captcha, waiting for solution..');
        await page.screenshot({ path: publicFolder + 'before-captcha.png' });
        const solution = await waitForCaptchaInput();
        log('found solution: ', solution);
        await page.screenshot({ path: publicFolder + 'after-captcha.png' });
        await page.type('#captchaInput', solution);
        await page.screenshot({ path: publicFolder + 'after-captcha2.png' });
        // const [response] = await Promise.all([
        //   page.waitForNavigation(waitOptions),
        //   page.click(selector, clickOptions),
        // ]);
        //const navigationPromise = page.waitForNavigation({waitUntil: 'networkidle0'});
        await page.screenshot({ path: publicFolder + 'solved-captcha.png' });
        await page.waitFor(3000);
        //await page.click('#submitObject'); // Clicking the link will indirectly cause a navigation
        //const res = await navigationPromise; // The navigationPromise resolves after navigation has finished
        //console.log(await res.text());   
    }

    // start scraping
    await page.waitFor("#main_table", { timeout: 120000 });
    await page.screenshot({ path: publicFolder + 'homepage.png' });
    log('found main table of results');
    const parsedAds = await page.evaluate(() => {
        const adsResults = [];
        const ads = $("#main_table .main_table tr.showPopupUnder");
        ads.each(function(i, ad) {
            // get the href attribute of each link
            var adResult = {};
            adResult.id = $(ad).attr("id").split("_").splice(-1)[0];
            $(ad).find('td').each(function(idx, td) {
                if (idx === 8) { adResult.address = $(td).text().trim(); }
                if (idx === 10) { adResult.price = $(td).text().trim(); }
                if (idx === 12) { adResult.rooms = $(td).text().trim(); }
                if (idx === 14) { adResult.entranceDate = $(td).text().trim(); }
                if (idx === 16) { adResult.floor = $(td).text().trim(); }
                if (idx === 20) { adResult.adDate = $(td).text().trim(); }
            });
            adsResults.push(adResult);
        });
        return adsResults;
    });

    log('Found # ads:', parsedAds.length);
    let count = 0;
    for (const ad of parsedAds) {
        const existingAd = adsDB.get('ads')
            .find({ id: ad.id })
            .value();

        if (!existingAd) {
            // new ad
            count += 1;
            ad.link = "http://www.yad2.co.il/Nadlan/rent_info.php?NadlanID=" + ad.id;
            log('Fetching', ad.link);
            await page.goto(ad.link);
            await page.waitFor(10000);
            await page.waitFor("#mainFrame", { timeout: 60000 * 5 }); // max 5 minutes
            const adDetails = await page.evaluate(() => {
                const data = {};
                $('.innerDetailsDataGrid').each((index, dataBlock) => {
                    if (index === 0) {
                        $(dataBlock).find('td').each(function(idx, td) {
                            if (idx === 3) { data.city = $(td).text().trim(); }
                            if (idx === 5) { data.hood = $(td).text().trim(); }
                            if (idx === 9) { data.fullAddress = $(td).text().trim(); }
                            if (idx === 19) { data.sqrmeter = $(td).text().trim(); }
                        });
                    };
                });
                // console.log('nadlan data', JSON.stringify(data));
                // remove info divs scrollbars for screenshots
                $('.details_block_296 .details_block_body div:nth-child(2)').css({ height: 'inherit' });
                return data;
            });
            ad.data = adDetails;

            // screenshot the data
            const infoElement = await page.$('#mainFrame > div.right_column > div > div > table > tbody > tr:nth-child(1) > td:nth-child(1)');
            await infoElement.screenshot({ path: `${publicFolder}${ad.id}-info.png` });
            log('ad info screenshot created ' + `${publicFolder}${ad.id}-info.png`);

            // get the images and the map location
            log('Fetching images and map data');
            await page.goto(`http://www.yad2.co.il/Nadlan/ViewImage.php?CatID=2&SubCatID=2&RecordID=${ad.id}`, { waitUntil: ['load', 'domcontentloaded', 'networkidle0'] });
            const adMetaData = await page.evaluate(() => {
                return {
                    images: ImageArr ? ImageArr : [],
                    map: mapOptions
                };
            });
            adMetaData.images.unshift(`http://172.104.211.48:3000/${ad.id}-info.png`);
            ad.meta = adMetaData;

            // write to DB
            adsDB.get('ads')
                .push(ad)
                .write();

            //messenger

            log('webhook bot data => ', JSON.stringify(ad));
            console.info(ad);
            const reqOptions = {
                uri: 'https://flatbot.glitch.me/pushNewAd',
                method: 'POST',
                json: true,
                body: ad
            };
            request(reqOptions);
            await delay(15000);
        } else {
            // existing ad, check for price change
            // if changed update the new price and alert
            if (existingAd.price != ad.price) {
                const reqOptions = {
                    uri: 'https://flatbot.glitch.me/pushAdUpdate',
                    method: 'POST',
                    json: true,
                    body: ad
                };
                request(reqOptions);
                log('found existing ad with price change, sending update ');
                adsDB.get('ads')
                    .find({ id: existingAd.id })
                    .assign({ price: ad.price })
                    .write()
            }

        }
    }
    log('done, found', count, 'new ads');
    await browser.close();
});

async function mainWrapper(yad2ResultsURL) {
    for (let i in yad2ResultsURL) {
        let curUrl = yad2ResultsURL[i];
        await main(curUrl)
            .then(async() => {
                log('main then');
                await delay(60000 * 15); // every 15 min
                log('done [then]');
                log('calling main again!');
            })
            .catch(async(err) => {
                log('main catch - error:', err);
                await delay(60000 * 15); // every 15 min
                log('done [err]');
                log('calling main again!');
            });
    }
    mainWrapper(yad2ResultsURL);
}
const yad2ResultsURL = config.yad2ResultsURL;
console.log(`Checking for those URLs: ${yad2ResultsURL}`)
mainWrapper(yad2ResultsURL);
