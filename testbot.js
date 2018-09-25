const low = require('lowdb');
const request = require('request');

// LowDB init
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('./.data/db.json');
const db = low(adapter);

const ad = db
  .get('ads')
  .find({ id: '3506707' })
  .value();

console.log(ad);
const reqOptions = {
  uri: 'https://flatbot.glitch.me/pushNewAd',
  method: 'POST',
  json: true,
  body: ad
};
request(reqOptions);