const fetch = require('node-fetch');
require('dotenv').config();
const OAuth = require('oauth');

var oauth = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    process.env.API_KEY,
    process.env.API_SECRET,
    '1.0A',
    null,
    'HMAC-SHA1',
);

const step1 = () => {
    oauth.getOAuthRequestToken(function (
        error,
        oAuthToken,
        oAuthTokenSecret,
        results,
    ) {
        var authURL =
            'https://twitter.com/' +
            'oauth/authenticate?oauth_token=' +
            oAuthToken;
        console.log('Open this in your browser:', authURL);
        console.log('Secret:', oAuthTokenSecret);
        console.log(
            'And then get the variables out of the callback url, and run:\n\nnode index.js ' +
                oAuthTokenSecret +
                ' [oauth_token] [oauth_verifier]',
        );
    });
};

const step2 = (secret, oauth_token, oauth_verifier) => {
    var getOAuthRequestTokenCallback = function (
        error,
        oAuthAccessToken,
        oAuthAccessTokenSecret,
        results,
    ) {
        if (error) {
            console.log(error);
            return;
        }

        oa.get(
            'https://api.twitter.com/1.1/account/verify_credentials.json',
            oAuthAccessToken,
            oAuthAccessTokenSecret,
            function (error, twitterResponseData, result) {
                if (error) {
                    console.log(error);
                    res.end(JSON.stringify(error));
                    return;
                }
                try {
                    console.log(JSON.parse(twitterResponseData));
                } catch (parseError) {
                    console.log(parseError);
                }
                console.log(twitterResponseData);
                console.log('TOKEN:', oAuthAccessToken);
                console.log('SECRET:', oAuthAccessTokenSecret);
            },
        );
    };
    oa.getOAuthAccessToken(
        oauth_token,
        secret,
        oauth_verifier,
        getOAuthRequestTokenCallback,
    );
};

const [_, __, secret, oauth_token, oauth_verifier] = process.env;
if (secret && oauth_token && oauth_verifier) {
    step2(secret, oauth_token, oauth_verifier);
} else {
    step1();
}
