// Ok

if (
    'API_KEY|API_SECRET|USER_TOKEN|USER_SECRET'
        .split('|')
        .some((name) => !process.env[name])
) {
    console.log('Environmental variables missing!');
    process.exit(1);
}

var Twitter = require('twitter-lite');
const fs = require('fs');
const { allChunks } = require('./utils');

async function tweetThread(client, thread) {
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

const tweetFromFile = async (client, filename) => {
    if (!fs.existsSync(filename)) {
        console.error(`File not found: ${filename}`);
        process.exit(2);
    }

    const raw = fs.readFileSync('introduction.txt', 'utf8');
    const chunks = allChunks(raw);
    console.log(`Tweeting a thread with ${chunks.length} tweets`);
    await tweetThread(client, chunks);
    console.log('Finished');
};

const tweetDate = async (client) => {
    await client.post('statuses/update', {
        status: 'Testing at ' + new Date().toLocaleString(),
    });
};

var client = new Twitter({
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_SECRET,
    access_token_key: process.env.USER_TOKEN,
    access_token_secret: process.env.USER_SECRET,
});

tweetDate(client);
