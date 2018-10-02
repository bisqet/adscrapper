module.exports = process.pid; //to relaunch server.

if (!module.parent) {
    indexApp();
} //check if it required -- NOT LAUNCH SCRAPPER

function indexApp() {
    const reload = require('require-reload')(require)
    const fs = require('fs');
    const util = require('util');
    const readFile = util.promisify(fs.readFile);
    const deleteFile = util.promisify(fs.unlink);
    const puppeteer = require('puppeteer');
    const request = require('request');
    const log = require('./log.js');
    const low = require('lowdb');
    const config = reload('./config.js');
    const messageBot = require('./messageBot.js')

    messageBot.customMessage({ 'err': 'SCRAPPER STARTED', 'url': 'https://linode.com' });

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

    const parseDataUrl = (dataUrl) => {
        const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
        if (matches.length !== 3) {
            throw new Error('Could not parse data URL.');
        }
        return { mime: matches[1], buffer: Buffer.from(matches[2], 'base64') };
    };

    const waitForCaptchaInput = () => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
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
    fs.writeFileSync('.isServerWakeUpable', "false", 'utf8');

    const publicFolder = './public/';

    reload('./config.js');

    const main = (async (yad2ResultsURL, browser) => {

        const page = await browser.newPage();

        page.setDefaultNavigationTimeout(120000 * 2);

        await page.goto(yad2ResultsURL);

        // check for captcha
        await page.waitFor("#main_table", { timeout: 180000 })
        //log("main table found")

        const searchSource = await page.content();
        //log("searchSource found");

        if (searchSource.indexOf('Are you human?') > -1) {
            log("ERROR CAPTCHA!!!");
            await sendErrorMessage({ "err": "ERROR CAPTCHA!!!", "url": yad2ResultsURL });
            return;
            /*/ get the image
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
            //console.log(await res.text()); */
        }

        // start scraping

        await page.screenshot({ path: publicFolder + 'homepage.png' });
        const parsedAds = await page.evaluate(() => {
            const adsResults = [];
            const ads = $("#main_table .main_table tr.showPopupUnder");
            console.info(ads);
            ads.each(function(i, ad) {
                // get the href attribute of each link
                var adResult = {};
                adResult.id = $(ad).attr("id").split("_").splice(-1)[0];
                $(ad).find('td').each(function(idx, td) {
                    if (idx === 4) { adResult.type = $(td).text().trim(); }
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
        log('Total ads on page:', parsedAds.length);
        let count = 0;
        let filteredBySqr = 0;
        let filteredByCity = 0;
        for (const ad of parsedAds) {
            const existingAd = adsDB.get('ads')
                .find({ id: ad.id })
                .value();

            if (!existingAd) {
                // new ad
                count += 1;
                ad.link = "http://www.yad2.co.il/Nadlan/rent_info.php?NadlanID=" + ad.id;
                //log('Fetching', ad.link);
                await page.goto(ad.link);

                await page.waitFor(15000);

                await page.waitFor("#mainFrame", { timeout: 60000 * 5 }); // max 5 minutes
                const adDetails = await page.evaluate(() => {
                    const data = {};
                    $('.innerDetailsDataGrid').each((index, dataBlock) => {
                        if (index === 0) {
                            $(dataBlock).find('td').each(function(idx, td) {
                                if (td.textContent.match('ישוב') !== null) { data.city = td.nextElementSibling.innerText; }
                                if (td.textContent.match("שכונה:") !== null && td.textContent.match("על השכונה:") === null) { data.hood = td.nextElementSibling.innerText }
                                if (td.textContent.match("כתובת:") !== null) { data.fullAddress = td.nextElementSibling.innerText }
                                if (td.textContent.match('גודל במ"ר:') !== null) { data.sqrmeter = parseInt(td.nextElementSibling.innerText) }
                            });
                        };
                        if (index === 1) {
                            data.sqrin = "*";
                            data.sqrgarden = "*";
                            $(dataBlock).find('td').each(function(idx, td) {
                                if (td.lastChild.textContent.match('מ"ר בנוי') !== null) { data.sqrin = td.nextElementSibling.innerText; }
                                if (td.lastChild.textContent.match('מ"ר גינה:') !== null) { data.sqrgarden = td.nextElementSibling.innerText }
                                if (td.lastChild.textContent.match('השכרה לטווח ארוך') !== null) { data.term = td.children[0].classList.value == "v_checked" ? "ארוך" : "קצר!!"; }
                            });
                            let container = dataBlock.nextElementSibling;
                            data.more = container.lastElementChild.innerText;
                            data["tax/m"] = "*";
                            data.vaad = "*";
                            for (let i = 0; i < container.children[2].childNodes.length; i++) {
                                let cell = container.children[2].childNodes[i];
                                if (cell.textContent.match('ארנונה לחודשיים') !== null) {
                                    data["tax/m"] = cell.nextSibling.innerText.slice(1).replace(",", "") / 2
                                }
                                if (cell.textContent.match('תשלום לועד בית') !== null) {
                                    data.vaad = cell.nextSibling.innerText.slice(1)
                                }
                            }
                        };
                    });

                    // remove info divs scrollbars for screenshots
                    $('.details_block_296 .details_block_body div:nth-child(2)').css({ height: 'inherit' });
                    return data;
                });

                if (!(await sqrFilter(adDetails.sqrmeter))) {
                    filteredBySqr++;
                    continue;
                }
                if (!(await cityFilter(adDetails.city, adDetails.hood))) {
                    filteredByCity++;
                    continue;
                }
                ad.data = adDetails;

                // screenshot the data
                const infoElement = await page.$('#mainFrame > div.right_column > div > div > table > tbody > tr:nth-child(1) > td:nth-child(1)');
                await infoElement.screenshot({ path: `${publicFolder}${ad.id}-info.png` });
                //log('ad info screenshot created ' + `${publicFolder}${ad.id}-info.png`);

                // get the images and the map location
                //log('Fetching images and map data');
                await page.goto(`http://www.yad2.co.il/Nadlan/ViewImage.php?CatID=2&SubCatID=2&RecordID=${ad.id}`, { waitUntil: ['load', 'domcontentloaded', 'networkidle0'] });
                let  adMetaData = {}
                try{
                adMetaData = await page.evaluate(() => {
                    if (mapOptions === undefined) {
                        mapOptions = [];
                    }
                    if (ImageArr === undefined) {
                        ImageArr = []
                    }
                    return {
                        images: ImageArr,
                        map: mapOptions
                    };
                });}catch(e){
                    log("MAP OPTIONS IS NOT DEFINED ERROR")
                }
                adMetaData.images.unshift(`http://172.104.211.48:3000/${ad.id}-info.png`);
                ad.meta = adMetaData;

                // write to DB
                adsDB.get('ads')
                    .push(ad)
                    .write();

                //messenger

                //log('webhook bot data => ', JSON.stringify(ad));
                //console.info(ad);
                messageBot.pushNewAd(ad)
                await delay(15000);
            } else {
                // existing ad, check for price change
                // if changed update the new price and alert
                if (existingAd.price != ad.price) {
                    messageBot.pushAdUpdate(ad);
                    log('found existing ad with price change, sending update ');
                    adsDB.get('ads')
                        .find({ id: existingAd.id })
                        .assign({ price: ad.price })
                        .write()
                }

            }
        }
        log(`Total skipped-duplicate - due to DB: ${parsedAds.length-count}`);
        log('Total skipped due to city filter: ', filteredByCity);
        log('Total skipped due to SQR filter: ', filteredBySqr);
        log('Total msgs: ', count - filteredByCity - filteredBySqr);
    });
    async function sqrFilter(sqr) {
        if (!sqr) return true;
        const filter = config.sqrFilter;
        if (filter.match("all") !== null || filter === "") return true
        try {
            log(`SQRfilter IS: ${filter}`);
            log(`SQR IS: ${sqr}`);
            log(`SQR RESULT IS: ${!!(eval(filter))}`);
            return !!(eval(filter));
        } catch (err) {
            await sendErrorMessage({ err: "ERROR WITH PARSING SQRFILTER!!!" })
            log("ERROR WITH PARSING SQRFILTER!!!");
            log(err);
            return false;
        }
    }

    async function cityFilter(city, hood) {
        if (!city) return true;
        const { acceptable, unacceptable, mode } = config.cityFilter;
        //log(`CITIES unacceptable IS: ${unacceptable}`);
        //log(`CITY IS: ${city}`);
        /*{
            [cityName, hoodname, hoodname],
            [cityName, hoodname, hoodname],
            "cityName"
        }*/

        if (mode === 0) {

            for (let i in acceptable) {
                if(acceptable[i]===city){
                    return true;
                }//cities without approved hoods will be approved
                if(typeof acceptable[i]!=="object"){
                    continue;
                }//check is this city without hoods or no
                for (let o in acceptable[i]) {

                    if (o === 0 && acceptable[i][o] !== city) {
                        break;
                    }
                    if (acceptable[i][o] == hood&&acceptable[i][0] ===city) {
                        return true
                    }

                }

            }
            return false
        }

        for (let i in unacceptable) {

            if (unacceptable[i] == city) {
                //log(`CITY RESULT IS: FALSE`);
                return false
            }//unacceptable cities without acceptable hoods will be rejected
            if(typeof unacceptable[i]!=="object"){
                continue;
            }//if city haven't hoods then
            for (let o in unacceptable[i]) {
              if (o === 0 && unacceptable[i][o] !== city) {
                break;
              }
              if (unacceptable[i][o] == hood&&unacceptable[i][0] ===city) {
                return true
              }
            }
            if(unacceptable[i][0] ===city)return false
        }
        return true
    }

    async function isServerNeedsToStop(){
        const isStopNeeded = fs.readFileSync('.restartNeeded', 'utf8') === "true" ? true : false
        fs.writeFileSync('.restartNeeded', "false", 'utf8');
        if (isStopNeeded) {
            await messageBot.customMessage({ 'err': 'SCRAPPER STOPPED', 'url': 'https://linode.com' });
            log("SCRAPPER STOPPED");
            fs.writeFileSync('.isServerWakeUpable', "true", 'utf8');
            await delay(3000);

            //process.on("exit", async function() {});
            process.exit();
        }
    }

    async function mainWrapper(yad2ResultsURL) {
        let errorsInARow = 0
        for (let i = 0; i < yad2ResultsURL.length; i++) {
            await isServerNeedsToStop();
            const browser = await puppeteer.launch({
                args: ['--no-sandbox']
            });
            let curUrl = yad2ResultsURL[i];
            //log(`Current scrape for ${curUrl}`);
            if(errorsInARow===3){
                if(i==yad2ResultsURL.length-1){
                    break;
                }
                i++;
            }
            log(`URL №${i+1}`);
            await main(curUrl, browser)
                .then(async () => {
                    log('Successful.');
                })
                .catch(async (err) => {
                    log('ERROR HAPPENED', err);
                    i--;
                });
            errorsInARow = 0;
            await browser.close();
            
            await isServerNeedsToStop();

            await delay(60000); // every 0ne min
        }
        for(let i = 0;i<240;i++){
            await delay(15000); 
            await isServerNeedsToStop();//check for stop each 15 secs
        }// every 60 min
        //log('calling main again!');
        mainWrapper(yad2ResultsURL);
    }






    const yad2ResultsURL = config.yad2ResultsURL;
    //log(`Checking for URLs:\n ${yad2ResultsURL.join('\n\n')}`)
    mainWrapper(yad2ResultsURL);

    async function sendErrorMessage(err) {
        log(err);
        messageBot.customMessage(err)
    }



}