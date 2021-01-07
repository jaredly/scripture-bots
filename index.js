const express = require('express');
const app = express();

const fs = require('fs');
if (!fs.existsSync('.data')) {
    fs.mkdirSync('.data');
}

const lastPath = './.data/last';
let last = fs.existsSync(lastPath) ? +fs.readFileSync(lastPath, 'utf8') : null;

const updateLast = () => {
    last = Date.now();
    fs.writeFileSync(lastPath, last + '', 'utf8');
};

app.use(express.static('public'));

let tweeting = false;

app.get('/', (request, response) => {
    if (tweeting) {
        return response.send('Duplicate');
    }
    if (Date.now() - last > 5 * 1000 * 60) {
        tweeting = true;
        tweetDate(client).then(
            () => {
                tweeting = false;
                updateLast();
                response.send(`Tweeted. ${last}`);
            },
            (err) => {
                tweeting = false;
                console.error(err);
                response.send(`Failed to tweet.`);
            },
        );
    } else {
        response.send(`Hello folks. Checking now, thanks. ${last}`);
    }
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});
