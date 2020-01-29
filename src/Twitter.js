var ISource = require("./ISource");
var TwitterApi = require('twitter');

class Twitter extends ISource
{
    constructor(hashtag, twitterApi)
    {
        super("Twitter", hashtag);
        this.twitterClient = new TwitterApi(twitterApi);
        this.stream = this.twitterClient.stream('statuses/filter', 
                                                {track: "#" + this.hashtag});
        this.stream.on('data', (event)=>{
            this.parseTweet(event);
        });
    }

    parseTweet(data)
    {
        var img = null;
        if('entities' in data)
        {
            if('media' in data.entities)
            {
                img = data.entities.media[0].media_url;
            }
        }
        this.newData({
            "user": data.user.screen_name,
            "text": data.text,
            "timestamp": (new Date(data.created_at)).getTime()/1000,
            "image": img
        });
    }
}

module.exports = Twitter