require('dotenv').config();

console.log('ok');

var Twit = require('twitter-lite');

var client = new Twit({
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_SECRET,
    access_token_key: process.env.USER_TOKEN,
    access_token_secret: process.env.USER_SECRET,
});

const fs = require('fs');
const raw = fs.readFileSync('introduction.txt', 'utf8');

const chunkify = (text) => {
    if (text.length <= 280) {
        return [text, ''];
    }
    const first = text.slice(0, 280);
    const last = first.match(/\w*$/);
    const len = first.length - last[0].length;
    console.log(last);
    return [text.slice(0, len), text.slice(len)];
};

const allChunks = (text) => {
    const chunks = [];
    while (text.length) {
        const [a, b] = chunkify(text);
        chunks.push(a);
        text = b;
    }
    return chunks;
};

const chunks = allChunks(raw);

async function tweetThread(thread) {
    let lastTweetID = '';
    for (const status of thread) {
        const tweet = await client.post('statuses/update', {
            status: status,
            in_reply_to_status_id: lastTweetID,
            auto_populate_reply_metadata: true,
        });
        lastTweetID = tweet.id_str;
        console.log('.');
    }
}

tweetThread(chunks).then(() => console.log('Good'));
