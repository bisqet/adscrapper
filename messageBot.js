const request = require('request');

exports.pushNewAd = async function(ad) {
    const reqOptions = {
        uri: 'https://flatbot.glitch.me/pushNewAd',
        method: 'POST',
        json: true,
        body: ad
    };
    request(reqOptions);
}

exports.pushAdUpdate = async function(ad) {
    const reqOptions = {
        uri: 'https://flatbot.glitch.me/pushAdUpdate',
        method: 'POST',
        json: true,
        body: ad
    };
    request(reqOptions);
}

exports.customMessage = async function(msg) {
    const reqOptions = {
        uri: 'https://flatbot.glitch.me/errorMessage',
        method: 'POST',
        json: true,
        body: msg
    };
    request(reqOptions);
}