const config = require('../config.js');
const request = require('request');
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
    <title>YAD2 ADS SCRAPPER</title>
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
        background: #ff3a3a;
        margin: auto;
        margin-top: 5px;
        width: 315px;
        background-color:#5264ae;
      }
    </style>
</head>

<body>
    <main>
        <section id='settingsBar'>
            <div class='section'>
                <textarea id='scrapeLinks' class='textarea' value='' style='font-size:80%'></textarea>
                <label class='scrapeLink'>Links to scrape</label>
            </div>
            <div>
                <div class='section'>
                    <textarea id='unacceptableCities' class='textarea' value=''></textarea>
                    <span class='bar'></span>
                    <label class='scrapeLink'>Unacceptable cities</label>
                </div>
            </div>
            <div>
                <div class='group section'>
                    <input id='sqrfilterContainer'  type='text' value='${config.sqrFilter!==undefined?config.sqrFilter:''}'>
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
                <button id='restartServerButton' class='stopServer sendButton' style=''>STOP SERVER</button>
                <button id='startServerButton' class='startServer sendButton' style='color:mediumpurple'>START SERVER</button>
            </div>
        </section>
    </main>
    <footer id='snackBar'></footer>
    <script type='text/javascript'>
        //scrapeLinks unacceptableCities sqrfilter
        changeSettingsButton.addEventListener('click', changeSettings);
        clearDBButton.addEventListener('click', clearDB);
        restartServerButton.addEventListener('click', restartServer);
        startServerButton.addEventListener('click', startServer)

        function clearDB(){
            fetch('/clearDB').then((res)=>{
                return res.text()
            }).then((res)=>{
                snackBar.innerText = res;
                snackBar.classList = 'active';
                setTimeout(()=>{snackBar.classList = ''}, 2000)
            })
        }
        function startServer(){
            fetch('/startServer').then((res)=>{
                return res.text()
            }).then((res)=>{
                snackBar.innerText = res;
                snackBar.classList = 'active red';
                setTimeout(()=>{snackBar.classList = ''}, 2000)
            })
        }
        function changeSettings(){
            const links = scrapeLinks.value.split('\\n');
            const unacceptable = unacceptableCities.value.split('\\n');
            const sqrfilter = sqrfilterContainer.value;
            fetch('/changeSettings', {
                method:'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                body:JSON.stringify({
                    yad2ResultsURL:links,
                    cityFilter:{
                        unacceptable:unacceptable,
                        acceptable:[],
                        mode:1
                    },
                    sqrfilter:sqrfilter
                })
            }).then((res)=>{
                return res.text()
            }).then((res)=>{
                snackBar.innerText = res;
                snackBar.classList = 'active';
                setTimeout(()=>{snackBar.classList = ''}, 2000)
            })
        }
        function restartServer(){
            fetch('/restartServer').then((res)=>{
                return res.text()
            }).then((res)=>{
                snackBar.innerText = res;
                snackBar.classList = 'active red';
                setTimeout(()=>{snackBar.classList = ''}, 2000)
            })
        }
        scrapeLinks.value = \`${config.yad2ResultsURL!==undefined?config.yad2ResultsURL.join('\n'):''}\`;
        unacceptableCities.value = \`${config.cityFilter!==undefined?config.cityFilter.unacceptable.join('\n'):''}\`;
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
        messageBot.customMessage({ 'err': 'SETTINGS CHANGED', 'url': 'https://linode.com' });

        log('SETTINGS CHANGED');

        res.send('SETTINGS CHANGED');
        return;
    });
});
app.get('/startServer', (req, res) => {
    const isWakeUpable = fs.readFileSync('../.isServerWakeUpable')
    if (isWakeUpable == "true"){
            cmd.get(
            `cd ../
            npm run scrapper`,
            function(err, data, stderr){
                if(err){
                messageBot.customMessage({ 'err': 'ERROR WHILE STARTING SERVER', 'url': 'https://linode.com' });
                    return;
                }
                messageBot.customMessage({ 'err': 'SERVER STARTED', 'url': 'https://linode.com' });
            }
        );  
    }

        
});
app.get('/stopServer', (req, res) => {

    fs.writeFile('.restartNeeded', "true", 'utf8', (err, data) => {
        if (err) {
            log(err);
            res.send('FAILED STOP SERVER');
            messageBot.customMessage({ 'err': 'FAILED STOP SERVER', 'url': 'https://linode.com' });
            return;
        }
        messageBot.customMessage({ 'err': 'SERVER WILL BE STOPPED IN NEXT TICK', 'url': 'https://linode.com' });

        log('SERVER WILL BE STOPPED IN NEXT TICK');

        res.send('SERVER WILL BE STOPPED IN NEXT TICK');        
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
            res.send('FAILED RESTART SERVER');
            messageBot.customMessage({ 'err': 'FAILED RESTART SERVER', 'url': 'https://linode.com' });
            return;
        }

        log('SERVER WILL BE RESTARTED IN NEXT TICK');

        res.send('SERVER WILL BE RESTARTED IN NEXT TICK');        
    });

        

});

app.use(express.static('public'));


app.listen(3000, function () {
    log('GUI SERVER LISTENING ON 3000 PORT')
});