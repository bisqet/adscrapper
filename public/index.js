const reload = require('require-reload')(require);

let config = reload('../config.js');
//const request = require('request');
const fs = require('await-fs');
const syncFs = require('fs');
const messageBot = require('../messageBot.js')
const log = require('../log.js');
const bodyParser = require('body-parser');
const restart = require("../restartServer.js");
const scrapperPID = require("../index.js");

const cmd = require('node-cmd') 


const express = require('express');
const app = express();




app.use(bodyParser())


app.get('/', (req, res) => {
        //ctx.res.end('GG!');
    res.send(`<!DOCTYPE html>
<html>

<head>
    <title>YAD2 Scraper Bot Personal Ads (NO REALTORS)</title>
    <style>
        .sendButtonContainer{
  margin-top: 40px;
}
.sendButton{
  width: 315px;
  transition: all .5s;
  padding: 9px 35px !important;
  text-transform: capitalize;
  position: relative;
  font-family: ''Karla', Arial, sans-serif';
  font-weight: 700;
  background: #5264ae;
  color: #fff !important;
  border: none;
  cursor: pointer;
}
.group {
  position: relative;
  height: 64px;
}

input {
  margin: 0 auto;
  text-align: center;
  font-size: 18px;
  padding: 10px 10px 10px 5px;
  display: block;
  width: 600px;
  border: none;
  border-bottom: 1px solid #757575;
}

input:focus {
  outline: none;
}

label {
  margin: 0 auto;
  color: #999;
  font-size: 14px;
  font-weight: normal;
  position: relative;
  pointer-events: none;
  left: 5px;
  top: 10px;
  transition: 0.2s ease all;
  -moz-transition: 0.2s ease all;
  -webkit-transition: 0.2s ease all;
}


/* active state */

input:focus~label,
input:valid~label {
  font-size: 14px;
  top:0;
  color: #5264ae;
}

.bar {
  margin: 0 auto;
  position: relative;
  display: block;
  width: 615px;
}

.bar:before,
.bar:after {
  content: '';
  height: 2px;
  width: 0;
  bottom: 1px;
  position: absolute;
  background: #5264ae;
  transition: 0.2s ease all;
  -moz-transition: 0.2s ease all;
  -webkit-transition: 0.2s ease all;
}
.scrapeLink{
    position: static;

}

.bar:before {
  left: 50%;
}

.bar:after {
  right: 50%;
}
.section{
  margin-bottom: 15px;
}
.textarea{
  width: 100%;
  height: 200px;
}

/* active state */

input:focus~.bar:before,
input:focus~.bar:after {
  width: 50%;
}
#settingsBar{
  text-align: center;
  width: 90%;
  margin: auto;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';
}
@media (max-width: 530px) {
  #settingsBar{
    width: 90%;
    margin: 0 auto;
  }
}

        #snackBar{
        display: block;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 12px;
        background-color: #5264ae;
        color: white;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        text-align: center;
        will-change: transform;
        transform: translate3d(0, 100%, 0);
        transition-property: visibility, transform;
        transition-duration: 0.2s;
        visibility: hidden;
      }
      #snackBar.active {
        visibility: visible;
        transform: translate3d(0, 0, 0);
      }
      @media (min-width: 460px) {
        #snackBar {
          width: 320px;
          margin: auto;
        }
      }
      .stopServer{
    background: #ff3a3a;
    margin: auto;
    margin-top: 5px;
    width: 315px;
      }
      .startServer{
        margin: auto;
        margin-top: 5px;
        width: 315px;
        background-color:#8ae25d;
      }

.custom-radios div {
  display: inline-block;
}
.custom-radios input[type="radio"] {
  display: none;
}
.custom-radios input[type="radio"] + label {
  color: #333;
  font-family: Arial, sans-serif;
  font-size: 14px;
}
.custom-radios input[type="radio"] + label span {
  display: inline-block;
  width: 40px;
  height: 40px;
  margin: -1px 4px 0 0;
  vertical-align: middle;
  cursor: pointer;
  border-radius: 50%;
  border: 2px solid #FFFFFF;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.33);
  background-repeat: no-repeat;
  background-position: center;
  text-align: center;
  line-height: 44px;
}
.custom-radios input[type="radio"] + label span img {
  opacity: 0;
  transition: all .3s ease;
}
.custom-radios input[type="radio"]#color-1 + label span {
  background-color: #2ecc71;
}
.custom-radios input[type="radio"]#color-4 + label span {
  background-color: #e74c3c;
}
.custom-radios input[type="radio"]:checked + label span img {
  opacity: 1;
}
.custom-radios input[type="radio"]#color-3 + label span {
  background-color: #f1c40f;
}
.serverStatus{
  line-height: 44px;
}
.bg{
  display:none;
}
.citiesFilter{
  width: 49%;
    margin: 0 auto;
    display: inline-block;
    cursor: pointer;
    color: #999;
    font-size: 14px;
}
.bg{
  display: none
}
.active{
  color: #5264ae;
}
.restartServer{
  margin: auto;
  margin-top: 5px;
  width: 630px;
}
#livelogsContainer{
	width:80%;
	height:600px;
	background: black;
	color:white;
	margin:auto;
	overflow: scroll;
}
.leftField{
  width:49%;
  float: left;
}
.rightField{
  width:49%;
  float: right;
}
    </style>
</head>

<body>
    <main>
        <h1 style="text-align:center">YAD2 Scraper Bot Personal Ads (NO REALTORS)</h1>
        <section id='settingsBar'>
            <div class='section'>
                <textarea id='scrapeLinks's class='textarea' value='' style='font-size:80%'></textarea>
                <label class='scrapeLink'>Links to scrape</label>
            </div>
            <div>
                <div class='section' style="height: 220px;">
                    <textarea id='unacceptableCities' class='leftField textarea' value=''></textarea>
                    <textarea id='acceptableCities' class='leftField textarea bg' value=''></textarea>
                    <textarea id='unacceptableIds' class='rightField textarea' value='' style='font-size:80%'></textarea>
                    <span class='bar'></span>
                    <div class='leftField scrapeLink citiesFilter active' id ="unacceptableButton">City filter</div>
                    <div class='leftField scrapeLink citiesFilter' style="display:none"  id ="acceptableButton">Acceptable cities</div>
                    <div class='rightField scrapeLink citiesFilter active' style=""  id ="unacceptableIdsButton">Specific ad IDs filter</div>
                </div>
            </div>
            <div>
                <div class='group section'>
                    <input id='sqrFilterContainer' type='text' value=''>
                    <span class='bar'></span>
                    <label>SQR filter</label>
                    <div style='font-size: small; color: #999 '>f.e. sqr>90//&& - and; || - or; ! - not; >= - more or equal; all - accept all
                    </div>
                </div>
            </div>
            <div class='sendButtonContainer'>
                <button id='changeSettingsButton' class='sendButton'>SAVE SETTINGS</button>
                <button id='clearDBButton' class='sendButton' style=''>CLEAR DB</button>
            </div>
            <div>
              <button id='restartServerButton' class='restartServer sendButton' style='color:mediumpurple'>RESTART SCRAPPER</button>
            </div>
            <div>
                <button id='stopServerButton' class='stopServer sendButton' style=''>STOP SCRAPPER</button>
                <button id='startServerButton' class='startServer sendButton' style='color:mediumpurple'>START SCRAPPER</button>
            </div>
        </section>
        <section style="text-align:center">
            <div class="custom-radios serverStatus">
                Scrapper Status:
                <div>
                    <input type="radio" id="color-1" name="color" value="color-1" checked>
                    <label id='labelForStatus' for="color-1">
                        <span>
                  <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/check-icn.svg" alt="Checked Icon" />
                </span>
                    </label>
                </div>
        </section>
		<section id ="livelogsContainer" style="font-size:80%; font-family: consolas;"></section>
    </main>
    <footer id='snackBar'></footer>
    <script type='text/javascript'>
    unacceptableButton.addEventListener('click', citiesHandler)
    acceptableButton.addEventListener('click', citiesHandler)
    //scrapeLinks unacceptableCities sqrFilter
    changeSettingsButton.addEventListener('click', changeSettings);
    clearDBButton.addEventListener('click', clearDB);
    stopServerButton.addEventListener('click', stopServer);
    startServerButton.addEventListener('click', startServer)
    restartServerButton.addEventListener('click', restartServer);
	

    let currentServerStatus = "";
    let isRestarting = 0;
    let mode = 1;
    checkServerAvailibility();
    getLogs();

    function citiesHandler() {
      unacceptableCities.classList.toggle("bg");
      acceptableCities.classList.toggle("bg");
      unacceptableButton.classList.toggle("active");
      acceptableButton.classList.toggle("active");
      mode===1?mode=0:mode=1;
    }
    function clearDB() {
        fetch('/clearDB').then((res) => {
            return res.text()
        }).then((res) => {
            snackBar.innerText = res;
            snackBar.classList = 'active';
            setTimeout(() => { snackBar.classList = '' }, 2000)
        })
    }
    function restartServer(){
      isRestarting = 1
      stopServer();
    }

    function startServer() {
        if (currentServerStatus == "stopping") {
            snackBar.innerText = "Server is running now.";
            snackBar.classList = 'active red';
            setTimeout(() => { snackBar.classList = '' }, 2000)
            return;
        }
        fetch('/startServer').then((res) => {
            return res.text()
        }).then((res) => {
            snackBar.innerText = res;
            snackBar.classList = 'active red';
            setTimeout(() => { snackBar.classList = '' }, 2000)
        })
    }

    function changeSettings() {
        const links = scrapeLinks.value.split('\\n');
        const unacceptable = unacceptableCities.value.split('\\n').map(cityWithHoods=>{
          const res = cityWithHoods.split(',')
          if(res.length==1)return res[0]
          return res
        });
        const acceptable = acceptableCities.value.split('\\n').map(cityWithHoods=>{
          const res = cityWithHoods.split(',')
          if(res.length==1)return res[0]
          return res
        })
        const unacceptableIDs = unacceptableIds.value.split('\\n');
        const sqrFilter = sqrFilterContainer.value;

        fetch('/changeSettings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                yad2ResultsURL: links,
                cityFilter: {
                    unacceptable: unacceptable,
                    acceptable: acceptable,
                    mode: mode
                },
                unacceptableIDs : unacceptableIDs,
                sqrFilter: sqrFilter
            })
        }).then((res) => {
            return res.text()
        }).then((res) => {
            snackBar.innerText = res;
            snackBar.classList = 'active';
            setTimeout(() => { snackBar.classList = '' }, 2000)
        })
    }
    const serverIndicator = document.getElementById('color-1');

    function stopServer() {
        fetch('/stopServer').then((res) => {
            return res.text()
        }).then((res) => {
            currentServerStatus = "stopping"
            serverIndicator.checked = "false";
            serverIndicator.id = "color-3";
            labelForStatus.for = "color-3";
            snackBar.innerText = res;
            snackBar.classList = 'active red';
            setTimeout(() => { snackBar.classList = '' }, 2000)
        })
    }

    function checkServerAvailibility() {
        fetch('/checkServerAvailibility').then((res) => {
            return res.text()
        }).then((res) => {
            if (currentServerStatus == 'stopping') {
                if (res === "color-1") {
                    res = "color-3"
                }
            }
            res === "color-1" ? (serverIndicator.checked = true, currentServerStatus = "") : serverIndicator.checked = false;
            if(res === "color-4"){
              currentServerStatus = "";
              if(isRestarting){
                isRestarting = 0;
                startServer();
              }
            }
            serverIndicator.id = res;
            labelForStatus.for = res;
        })
    }
	function getLogs() {
        fetch('/getLogs').then((res) => {
            return res.json()
        }).then((res)=>{
			res = JSON.stringify(res.logs.slice(-100), null , 2)
			livelogsContainer.innerText = res;
		})
    }
	let a =[];
	for(let i = 0; i<120;i++)a.push('\\n')
	livelogsContainer.innerText = a

	livelogsContainer.scrollTop = 1520
    setInterval(()=>{
		checkServerAvailibility();
		getLogs();
		}, 5000);

    scrapeLinks.value = \`${config.yad2ResultsURL!==undefined?config.yad2ResultsURL.join('\n'):''}\`;
    unacceptableCities.value = \`${config.cityFilter!==undefined?config.cityFilter.unacceptable.join('\n'):''}\`;
    sqrFilterContainer.value =\`${config.sqrFilter!==undefined?config.sqrFilter:''}\`;
    unacceptableIds.value = \`${config.unacceptableIDs!==undefined?config.unacceptableIDs.join('\n'):''}\`
    </script>
</body>

</html>`);
});

app.post('/changeSettings', (req, res) => {

    const body = req.body;
	
    let stringifiedBody = `const config = ${JSON.stringify(body, null, 2)};\nmodule.exports = config;`;
    fs.writeFile('./config.js', stringifiedBody, 'utf8', (err, data) => {
        if (err) {
            log(err);
            res.send('FAILED TO CHANGE SETTINGS.');
            messageBot.customMessage({ 'err': 'FAILED TO CHANGE SETTINGS.', 'url': 'https://linode.com' });
            return;
        }
        config = reload('../config.js');
        messageBot.customMessage({ 'err': 'SETTINGS CHANGED', 'url': 'https://linode.com' });

        log('SETTINGS CHANGED');

        res.send('SETTINGS CHANGED');
        return;
    });
});
app.post('/banAds', (req, res) => {

    const body = req.body;
    config.unacceptableIDs.push(body.id);
    let stringifiedBody = `const config = ${JSON.stringify(config, null, 2)};\nmodule.exports = config;`;
    fs.writeFile('./config.js', stringifiedBody, 'utf8', (err, data) => {
        if (err) {
            log(err);
            res.send('FAILED TO BAN AD.');
            messageBot.customMessage({ 'err': 'FAILED TO BAN AD', 'url': 'https://linode.com' });
            return;
        }
        config = reload('../config.js');
        //messageBot.customMessage({ 'err': 'AD Banned', 'url': 'https://linode.com' });

        log('AD banned');

        res.send('AD banned');
        return;
    });
});

app.post('/captchaSolve', (req, res) => {
    const {answer} = req.body;
    messageBot.customMessage({ 'err': `Got solve, ${answer}`, 'url': 'https://linode.com' });
    fs.writeFile('./public/captcha.solve', answer ,'utf8',(err, data) => {
      if(err){
        console.error(err)
      }
    });
});

app.get('/getLogs', (req, res) => {
    const logs = syncFs.readFileSync('./.data/logsDB.json', "utf8");
    res.send(logs);
});


















app.get('/startServer', (req, res) => {
    const isWakeUpable = syncFs.readFileSync('./.isServerWakeUpable', "utf8")
    if (isWakeUpable == "true"){
          res.send("SCRAPPER STARTED");
            cmd.get(
            `cd /root/adscrapper/
            npm run scrapper`,
            function(err, data, stderr){
                if(err){
                  console.log(stderr)
                  messageBot.customMessage({ 'err': 'ERROR WHILE STARTING SCRAPPER', 'url': 'https://linode.com' });
                  return;
                }
            }
        );  
    }else{
      res.send("SCRAPPER CAN'T BE STARTED RIGHT NOW.");
    }

        
});


app.get('/checkServerAvailibility', (req, res) => {
    const isWakeUpable = syncFs.readFileSync('./.isServerWakeUpable', "utf8");
    res.send(isWakeUpable==="true"?"color-4":"color-1");
});



app.get('/stopServer', (req, res) => {

    fs.writeFile('.restartNeeded', "true", 'utf8', (err, data) => {
        if (err) {
            log(err);
            res.send('FAILED STOP SCRAPPER');
            messageBot.customMessage({ 'err': 'FAILED STOP SCRAPPER', 'url': 'https://linode.com' });
            return;
        }
        messageBot.customMessage({ 'err': 'SCRAPPER WILL BE STOPPED IN NEXT TICK', 'url': 'https://linode.com' });

        log('SCRAPPER WILL BE STOPPED IN NEXT TICK');

        res.send('SCRAPPER WILL BE STOPPED IN NEXT TICK');        
    });
        
});


app.get('/clearDB', (req, res) => {


    fs.writeFile('./adsDB.json', '', 'utf8', (err, data) => {
        if (err) {
            log(err);
            res.send('FAILED TO CLEAR DB.');
            messageBot.customMessage({ 'err': 'FAILED TO CLEAR DB', 'url': 'https://linode.com' });
            return;
        }
        messageBot.clearDB();

        messageBot.customMessage({ 'err': 'DB CLEARED', 'url': 'https://linode.com' });

        log('DB CLEARED');

        res.send('DB CLEARED');
        
    });

});


app.get('/restartServer', (req, res) => {

    fs.writeFile('.restartNeeded', "true", 'utf8', (err, data) => {
        if (err) {
            log(err);
            res.send('FAILED RESTART SCRAPPER');
            messageBot.customMessage({ 'err': 'FAILED RESTART SCRAPPER', 'url': 'https://linode.com' });
            return;
        }

        log('SCRAPPER WILL BE RESTARTED IN NEXT TICK');

        res.send('SCRAPPER WILL BE RESTARTED IN NEXT TICK');        
    });

        

});

app.use(express.static('public'));


app.listen(3000, function () {
    log('GUI SERVER LISTENING ON 3000 PORT')
});