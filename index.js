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

    const parseDataUrl = (dataUrl) => {
        const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
        if (matches.length !== 3) {
            throw new Error('Could not parse data URL.');
        }
        return { mime: matches[1], buffer: Buffer.from(matches[2], 'base64') };
    };

    const waitForCaptchaInput = () => {
        return new Promise((resolve, reject) => {
            const waitingInterval = setInterval(async () => {
                if (fs.existsSync('./public/captcha.solve')) {
                    log('found captcha');
                    const solution = await readFile('./public/captcha.solve', "utf8");
                    await deleteFile('./public/captcha.solve');
                    clearInterval(waitingInterval);
                    log('delete captcha and resolving..');
                    return resolve(solution);
                }
                
            }, 1000); // two minutes
        });
    }
    const checkForCaptcha = async (content, page) =>{
        if (content.indexOf('האם אתה אנושי?') > -1) {
            //log("ERROR CAPTCHA!!!");
            //await sendErrorMessage({ "err": "ERROR CAPTCHA! Waiting for solution..", "url": yad2ResultsURL });
            const captchaImg = await page.evaluate(() => document.querySelector('#captchaImageInline').src);
            const { buffer } = parseDataUrl(captchaImg);
            fs.writeFileSync(publicFolder + 'captcha.png', buffer, 'base64');
            messageBot.captchaMsg(WARN_CONFIG.DOMAIN+'/captcha.png')
            log('ERROR CAPTCHA! Waiting for solution..');
            const solution = await waitForCaptchaInput();
            await page.type('#captchaInput', solution);
            await page.click('#submitObject');
            return true;
        }else{
            return false;
        }
    }
    const checkforErrs = (content, proxyIndex)=>{
        if(content.indexOf('מתנצלים, המחשב חסום לגישה לאתר.') > -1){
            throw new Error('Bot')
        }
        if (content.indexOf('האם אתה אנושי?') > -1){
            throw new Error('captchaExist')
        }
        if (content.indexOf('Loading site please wait') > -1){
            throw new Error('Loading')
        }
    }
    fs.writeFileSync('.isServerWakeUpable', "false", 'utf8');

    const publicFolder = './public/';

    const main = (async (yad2ResultsURL, browser,isCaptchaHere, proxyIndex, browserOptions) => {

        let page = await browser.newPage();

        const preloadFile = fs.readFileSync('./preload.js', 'utf8');
        await page.evaluateOnNewDocument(preloadFile);
        //page.setViewport({width: getRandomInt(600, 1400), height:getRandomInt(600, 1400)})

        page.setDefaultNavigationTimeout(120000);

        //await page.setCookie({ "name": "LPVID", "value": "ZmYzgwMWE5ZTk0NWFiZjgy", "domain": ".yad2.co.il", "path": "/", "expires":-1, "size": 27, "httpOnly": false, "secure": false, "session": false }, { "name": "__gads", "value": "ID=b9a9e789e5177634:T=1540139029:S=ALNI_MavviTj33UKAqCJb4ePNNiWCZFWEw", "domain": ".yad2.co.il", "path": "/", "expires":-1, "size": 75, "httpOnly": false, "secure": false, "session": false }, { "name": "favorites_userid", "value": "hbc6646092529", "domain": ".yad2.co.il", "path": "/", "expires": 1540743818.036674, "size": 29, "httpOnly": false, "secure": false, "session": false }, { "name": "UTGv2", "value": "D-h4619bfc24ecb94c6fb5eb49aa4ee2be0631", "domain": "www.yad2.co.il", "path": "/", "expires":-1, "size": 43, "httpOnly": false, "secure": false, "session": false }, { "name": "realEstateBanner", "value": "20181021", "domain": "www.yad2.co.il", "path": "/", "expires":-1, "size": 24, "httpOnly": false, "secure": false, "session": false }, { "name": "sp_lit", "value": "E0FQ2YAt6/A9GRopJQdyEw==", "domain": "www.yad2.co.il", "path": "/", "expires":-1, "size": 30, "httpOnly": true, "secure": false, "session": false, "sameSite": "Strict" }, { "name": "LPSID-72457022", "value": "U1bCTgfkQ92YQqNtrEYsEQ", "domain": ".yad2.co.il", "path": "/", "expires":-1, "size": 36, "httpOnly": false, "secure": false, "session": true }, { "name": "spcsrf", "value": "49b330b6480dac09d7756ece51326647", "domain": "www.yad2.co.il", "path": "/", "expires":-1, "size": 38, "httpOnly": true, "secure": false, "session": false, "sameSite": "Strict" }, { "name": "SaveSearch_CustID", "value": "dai228208188", "domain": ".yad2.co.il", "path": "/", "expires":-1, "size": 29, "httpOnly": false, "secure": false, "session": false }, { "name": "yad2upload", "value": "2248146954.20480.0000", "domain": "www.yad2.co.il", "path": "/", "expires": -1, "size": 31, "httpOnly": true, "secure": false, "session": true }, { "name": "CLIENT_WIDTH_DIR", "value": "1280", "domain": "www.yad2.co.il", "path": "/Nadlan", "expires":-1, "size": 20, "httpOnly": false, "secure": false, "session": false }, { "name": "y2018-2-access", "value": "false", "domain": ".yad2.co.il", "path": "/", "expires":-1, "size": 19, "httpOnly": false, "secure": false, "session": false }, { "name": "SPSI", "value": "bbffee9d54b3054b7fc2e80b9cb76429", "domain": "www.yad2.co.il", "path": "/", "expires": -1, "size": 36, "httpOnly": false, "secure": false, "session": true }, { "name": "PHPSESSID", "value": "dgq0pf84fkrlgk1hj6o8hop9p2", "domain": "www.yad2.co.il", "path": "/", "expires": -1, "size": 35, "httpOnly": false, "secure": false, "session": true }, { "name": "PRLST", "value": "rD", "domain": "www.yad2.co.il", "path": "/", "expires": -1, "size": 7, "httpOnly": false, "secure": false, "session": true }, { "name": "y2018-2-cohort", "value": "10", "domain": "www.yad2.co.il", "path": "/", "expires": -1, "size": 16, "httpOnly": false, "secure": false, "session": false }, { "name": "adOtr", "value": "efbebdf59b4", "domain": "www.yad2.co.il", "path": "/", "expires": -1, "size": 16, "httpOnly": false, "secure": false, "session": true }, { "name": "MAIN_WIDTH_DIR", "value": "1280", "domain": "www.yad2.co.il", "path": "/Nadlan", "expires":-1, "size": 18, "httpOnly": false, "secure": false, "session": false });
        //fs.writeFileSync('./public/cookies.html', JSON.stringify(pendingccs, null, 2), 'utf8');        
        await page.goto(yad2ResultsURL);
        console.info('goto')


        //await delay(30000); //1m delay.
        //await delay(30000);
        const content = await page.content();
        console.info('content')
        const cookies = await page.cookies();

        checkforErrs(content, proxyIndex);
        await page.screenshot({ path: publicFolder + 'bancheck.png' });

        fs.writeFileSync('./public/bancheck.html', content, 'utf8');
        fs.writeFileSync('./public/cookies.html', JSON.stringify(cookies, null, 2), 'utf8');
        console.info('content wrote to bancheck.html')
        // check for captcha
        //let captchaExist = await checkForCaptcha(content, page);

        //await page.waitFor(1000);
        // start scraping
        await page.waitFor("#main_table", { timeout: 30000 })

        //if(captchaExist){
            //messageBot.customMessage({ 'err': 'Captcha solved succesfully!', 'url': 'https://linode.com' });
        //}
        await page.screenshot({ path: publicFolder + 'homepage.png' });

        let count = 0;
        let skippedDueCaptcha = 0;
        let filteredBySqr = 0;
        let filteredByCity = 0;
        let filteredID = 0;

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


        //checking existing in unacceptable cities
        for (let i in config.unacceptable) {
            for (let o = 0; o < parsedAds.length; o++) {
                //log(parsedAds[o])
                if (config.unacceptable[i] == parsedAds[o].city) {
                    filteredByCity++;
                    parsedAds.splice(o, 1)
                    o--;
                }
            }
        }
        //checking existing in unacceptable IDs
        for (let i in config.unacceptableIDs) {
            for (let o = 0; o < parsedAds.length; o++) {
                if (config.unacceptableIDs[i] == parsedAds[o].id) {
                    filteredID++;
                    parsedAds.splice(o, 1)
                    i--;
                }
            }
        }


        log('Total ads on page:', parsedAds.length + filteredID);
        await delay(5000)
        for (let i = 0; i < parsedAds.length; i++) {
            //await delay(60000); //1m delay.
            let ad = parsedAds[i];
            const existingAd = adsDB.get('ads')
                .find({ id: ad.id })
                .value();
/*http://www.yad2.co.il/Nadlan/rent.php?multiSearch=1&arrArea=3%2C10%2C78&arrCity=&arrHomeTypeID=3%2C6&fromRooms=3.5&untilRooms=5.5&fromPrice=1000&untilPrice=8000&PriceType=1&FromFloor=&ToFloor=&fromSquareMeter=90&untilSquareMeter=&Meshupatz=1&EnterDate=&Info=
http://www.yad2.co.il/Nadlan/rent_info.php?NadlanID=4cf417113b56b7d8002f30a2736d21a043b


CLIENT_WIDTH_DIR=1263; MAIN_WIDTH_DIR=1263; sbtsck=jav; PHPSESSID=fm8i87nhhep029nv8gl3vhhnv3; y2018-2-cohort=51; y2018-2-access=false; SaveSearch_CustID=hjj1617274001; realEstateBanner=20181021; favorites_userid=gjb9126643850; yad2upload=1694498826.20480.0000; LPVID=FjNGRiYTRkMzk1NTc2ZWM4; LPSID-72457022=i-It2JHVQeqMlCKsQ6noVA; _ga=GA1.3.6330954.1540149226; _gid=GA1.3.99456894.1540149226; SPSI=abe640550a513827373be80567859727; UTGv2=h4c5e37464205186dcffe06a3c191d15e740; searchB144FromYad2=2_C_1970; sp_lit=sa73P5HksV4yiR1VytQRtg==; PRLST=AQ; spcsrf=22cb1520849d9586e237c2a79c8ae3ae; adOtr=46b0a5P055a

*/


            if (!existingAd) {
                            let incognito =  await browser.createIncognitoBrowserContext();
            page = await incognito.newPage();
            page.setDefaultNavigationTimeout(120000);
                // new ad
                count++;
                ad.link = "http://www.yad2.co.il/Nadlan/rent_info.php?NadlanID=" + ad.id;
                //log('Fetching', ad.link);
                console.log('go to ', ad.link);
                let cookiesAd = await page.cookies();
                fs.writeFileSync('./public/cookies.html', JSON.stringify(cookiesAd), 'utf8');
                console.log('cookies wrote to cookies.html', ad.link);
                //await page.waitFor(50000)
                //await page.deleteCookie(...cookiesAd)
                await page.goto(ad.link);
                const contentAd = await page.content();
                console.log('got ', ad.link)
                //await delay(20000);
                //captchaExist = await checkForCaptcha(content, page);

                let error = 0;
                fs.writeFileSync('./public/bancheck.html', contentAd, 'utf8');

                console.info('contentAD wrote to bancheck.html');

                checkforErrs(contentAd, proxyIndex);

                
                await page.waitFor("#mainFrame", { timeout: 60000 })

                if (error !== 0) {
                    //log("WAITING FOR 5min:"+ad.link)
                    //delay(60300*5)//wait for 5 mins
                    error = 0;
                    continue;
                }

                console.log('Waited');
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
                                if (td.lastChild.textContent.match('משופצת') !== null) { data.renov = td.children[0].classList.value == "v_checked" ? "שופץ" : "לא-שופץ"; }
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
                let adMetaData = {}
                adMetaData.images = [];
                try {
                    adMetaData = await page.evaluate(() => {
                        if (ImageArr === undefined) {
                            ImageArr = []
                        }
                        return {
                            images: ImageArr
                        };
                    });
                } catch (e) {
                    adMetaData = {};
                    adMetaData.images = [];
                    log(e);
                }

                adMetaData.images.unshift(`${WARN_CONFIG.DOMAIN}/${ad.id}-info.png`);
                ad.meta = adMetaData;

                // write to DB
                adsDB.get('ads')
                    .push(ad)
                    .write();

                //messenger

                //log('webhook bot data => ', JSON.stringify(ad));
                //console.info(ad);
                messageBot.pushNewAd(ad)
                //await delay(15000);
                incognito.close()
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
        log(`Total skipped due captcha: ${skippedDueCaptcha}`)
        log('Total skipped due to city filter: ', filteredByCity);
        log('Total skipped due to SQR filter: ', filteredBySqr);
        log(`Total skipped due specific ad ID filter: ${filteredID}`)
        log('Total msgs: ', count - filteredByCity - filteredBySqr);
    });
    async function sqrFilter(sqr) {
        if (!sqr) return true;
        sqr = parseInt(sqr);
        const filter = config.sqrFilter;
        if (filter.match("all") !== null || filter === "") return true
        try {
            //log(`SQRfilter IS: ${filter}`);
            //log(`SQR IS: ${sqr}`);
            //log(`SQR RESULT IS: ${!!(eval(filter))}`);
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
                if (acceptable[i] === city) {
                    return true;
                } //cities without approved hoods will be approved
                if (typeof acceptable[i] !== "object") {
                    continue;
                } //check is this city without hoods or no
                for (let o in acceptable[i]) {

                    if (o === 0 && acceptable[i][o] !== city) {
                        break;
                    }
                    if (acceptable[i][o] == hood && acceptable[i][0] === city) {
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
            } //unacceptable cities without acceptable hoods will be rejected
            if (typeof unacceptable[i] !== "object") {
                continue;
            } //if city haven't hoods then
            for (let o in unacceptable[i]) {
                if (o === 0 && unacceptable[i][o] !== city) {
                    break;
                }
                if (unacceptable[i][o] == hood && unacceptable[i][0] === city) {
                    return true
                }
            }
            if (unacceptable[i][0] === city) return false
        }
        return true
    }

    async function isServerNeedsToStop() {
        const isStopNeeded = fs.readFileSync('.restartNeeded', 'utf8') === "true" ? true : false
        fs.writeFileSync('.restartNeeded', "false", 'utf8');
        if (isStopNeeded) {
            await messageBot.customMessage({ 'err': 'SCRAPPER STOPPED', 'url': 'https://linode.com' });
            log("SCRAPPER STOPPED");
            fs.writeFileSync('.isServerWakeUpable', "true", 'utf8');
            await delay(getRandomInt(3000, 4000));

            //process.on("exit", async function() {});
            process.exit();
        }
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    async function mainWrapper(yad2ResultsURL) {
        let errorsInARow = 0
        let mobileView = true;

        for (let i = 0; i < yad2ResultsURL.length; i++) {
            config = reload('./config.js');
            //WARN_CONFIG = reload('./config.js');

            await isServerNeedsToStop();
            const browserOptions = {
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

                `--proxy-server=${WARN_CONFIG.PROXIES[WARN_CONFIG.LAST_PROXY_INDEX].adress}`
                ],
                defaultViewport: {
                    width: mobileView === true ? 600 : 1280,
                    height: mobileView === true ? 800 : 600,
                    deviceScaleFactor: 1,
                    isMobile: mobileView,
                    hasTouch: false,
                    isLandscape: false
                }
            }
            const browser = await puppeteer.launch(browserOptions);
            console.info(`--proxy-server=${WARN_CONFIG.PROXIES[WARN_CONFIG.LAST_PROXY_INDEX].adress}`)
            let curUrl = yad2ResultsURL[i];
            //log(`Current scrape for ${curUrl}`);
            let isCaptchaHere = errorsInARow>0?true:false;

            /*if (errorsInARow >= 3) {
                if (i == yad2ResultsURL.length - 1) {
                    break;
                }
                for (let i = 0; i < 600; i++) {
                    await delay(getRandomInt(15000, 16000));
                    await isServerNeedsToStop(); //check for stop each 15-16 secs
                } // every 60 min
                i++;
            }*/
            log(`URL №${i+1}`);
            await main(curUrl, browser, isCaptchaHere, WARN_CONFIG.LAST_PROXY_INDEX, browserOptions)
                .then(async () => {
                    log('Successful.');
                    errorsInARow = 0;
                })
                .catch((err) => {
                    console.log(err)
                    log('PROXY CHANGED');
                    errorsInARow++;
                    i--;
                    WARN_CONFIG.LAST_PROXY_INDEX = WARN_CONFIG.LAST_PROXY_INDEX===WARN_CONFIG.PROXIES.length-1?0:WARN_CONFIG.LAST_PROXY_INDEX+1;
                    let WARN_CONFIG_plain = fs.readFileSync('./WARN_CONFIG.js', 'utf8');
                    fs.writeFileSync('./WARN_CONFIG.js',WARN_CONFIG_plain.replace(/LAST_PROXY_INDEX:([0-9].*?)\n/, `LAST_PROXY_INDEX:${WARN_CONFIG.LAST_PROXY_INDEX}\n`), 'utf8');
                    //mobileView = mobileView === true ? false : true;
                    console.info(' WARN_CONFIG.LAST_PROXY_INDEX:',  WARN_CONFIG.LAST_PROXY_INDEX)
                });
            await browser.close();

            await isServerNeedsToStop();

            //await delay(getRandomInt(60000, 120000)); // every 0ne - 2 min
        }
        for (let i = 0; i < 240; i++) {
            await delay(getRandomInt(15000, 16000));
            await isServerNeedsToStop(); //check for stop each 15-16 secs
        } // every 60 min
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