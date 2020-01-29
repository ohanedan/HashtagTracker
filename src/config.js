var Twitter = require("./Twitter");
var Instagram = require("./Instagram");

var config = {
    tcpHost: "0.0.0.0",
    tcpPort: 6161,
    socketAuthKey: "SOCKAUTHKEY",
    socketLoginTimeout : 10,
    sources: [
        new Twitter("HASHTAG", {
            consumer_key: 'YOUR TWITTER API CONSUMER KEY',
            consumer_secret: 'YOUR TWITTER API CONSUMER SECRET',
            access_token_key: 'YOUR TWITTER API ACCESS TOKEN',
            access_token_secret: 'YOUR TWITTER API ACCESS TOKEN SECRET'
        }),
        new Instagram("HASHTAG", 1000)
    ]
}

module.exports = config
