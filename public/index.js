const config = require('../config.js');
const request = require('request');
const fs = require('await-fs');
const syncFs = require('fs');
const messageBot = require('../messageBot.js')
const log = require('../log.js');
const bodyParser = require('body-parser');


const express = require('express');
const app = express();




app.use(bodyParser())


app.get('/', (req, res) => {
        console.log('request handled');
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
        background-color: ;
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
    </style>
</head>

<body>
    <main>
        <section id='settingsBar'>
            <div class='section'>
                <textarea id='scrapeLinks' class='textarea' value=''></textarea>
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
                <button id='changeSettingsButton' class='sendButton'>CHANGE SETTINGS</button>
                <button id='clearDBButton' class='sendButton' style=''>CLEAR DB</button>
            </div>
        </section>
    </main>
    <footer id='snackBar'></footer>
    <script type='text/javascript'>
        //scrapeLinks unacceptableCities sqrfilter
        changeSettingsButton.addEventListener('click', changeSettings);
        clearDBButton.addEventListener('click', clearDB);


        function clearDB(){
            fetch('/clearDB').then((res)=>{
                return res.text()
            }).then((res)=>{
                snackBar.innerText = res;
                snackBar.classList = 'active';
                setTimeout(()=>{snackBar.classList = ''}, 2000)
            })
        }
        function changeSettings(){
            const links = scrapeLinks.value.split('\n')
            const unacceptable = unacceptableCities.value.split('\n')
            const sqrfilter = sqrfilterContainer.value;
            fetch('/changeSettings', {
                method:'POST',
                body:{
                    yad2ResultsURL:links,
                    cityFilter:{
                        unacceptable:unacceptable,
                        acceptable:[],
                        mode:1
                    },
                    sqrfilter:sqrfilter
                }
            }).then((res)=>{
                return res.text()
            }).then((res)=>{
                snackBar.innerText = res;
                snackBar.classList = 'active';
                setTimeout(()=>{snackBar.classList = ''}, 2000)
            })
        }
        scrapeLinks.value = \`${config.yad2ResultsURL!==undefined?config.yad2ResultsURL.join('\n'):''}\`;
        unacceptableCities.value = \`${config.cityFilter.unacceptable!==undefined?config.cityFilter.unacceptable.join('\n'):''}\`;
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
            messageBot.customMessage({ 'err': 'FAILED TO CHANGE SETTINGS.', 'url': 'http://172.104.211.48:3000' });
            return;
        }
        messageBot.customMessage({ 'err': 'SETTINGS CHANGED. SERVER RESTARTED', 'url': 'http://172.104.211.48:3000' });

        log('SETTINGS CHANGED. SERVER RESTARTED');

        res.send('SETTINGS CHANGED.\n SERVER RESTARTED');
        return;
    });
});

app.get('/clearDB', (req, res) => {


    fs.writeFile('./adsDB.json', '', 'utf8', (err, data) => {
        if (err) {
            log(err);
            res.send('FAILED TO CLEAR DB.');
            messageBot.customMessage({ 'err': 'FAILED TO CLEAR DB.', 'url': 'http://172.104.211.48:3000' });
            return;
        }
        messageBot.customMessage({ 'err': 'DB CLEARED', 'url': 'http://172.104.211.48:3000' });

        log('DB CLEARED.\n SERVER RESTARTED');

        res.send('DB CLEARED.\n SERVER RESTARTED');
        
    });

});

app.use(express.static('public'));


app.listen(3000, function () {
    log('GUI SERVER LISTENING ON 3000 PORT')
});