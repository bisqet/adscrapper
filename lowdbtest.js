const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterAds = new FileSync('./adsDB.json');
const adsDB = low(adapterAds);
const posts = adsDB.has('ads').value()

console.log(posts);
const existingAd = adsDB.get('ads')
    .find({ id: '3547567' })
    .value();

console.log(existingAd);
