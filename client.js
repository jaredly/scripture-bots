// Yup

if (
    'API_KEY|API_SECRET|USER_TOKEN|USER_SECRET'
        .split('|')
        .some((name) => !process.env[name])
) {
    console.log('Environmental variables missing!');
    process.exit(1);
}

var Twitter = require('twitter-lite');
var client = new Twitter({
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_SECRET,
    access_token_key: process.env.USER_TOKEN,
    access_token_secret: process.env.USER_SECRET,
});

module.exports = client;
