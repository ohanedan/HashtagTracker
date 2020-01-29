const EventEmitter = require('events');

class ISource
{
    constructor(platform, hashtag)
    {
        this.eventManager = new EventEmitter();
        this.platform = platform;
        this.hashtag = hashtag;
    }

    newData(data)
    {
        this.eventManager.emit('data', {
            "platform":this.platform,
            "hashtag":this.hashtag,
            "data": data
        });
    }
}

module.exports = ISource