// Check for auth
const client = require('./client');
client
    .get('account/verify_credentials')
    .then((results) => {
        console.log('results', results);
    })
    .catch(console.error);
