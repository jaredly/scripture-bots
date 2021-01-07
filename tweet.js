// Ok
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

const client = require('./client');
tweetDate(client).catch((err) => console.error(err));
