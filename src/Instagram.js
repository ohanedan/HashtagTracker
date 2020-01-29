var ISource = require("./ISource");
const insta = require('instagram-hashtag-scrapper');

class Instagram extends ISource
{
    constructor(hashtag, checkDelay)
    {
        super("Instagram", hashtag);
        this.userDelay = checkDelay;
        this.lastPosts = [];
        this.checkData(true);
    }

    async checkData(firstTime)
    {
        this.checkDelay = this.userDelay;
        await insta.scrapeTagPage(this.hashtag).then(async (result) => {
            for(var i = 4; i>= 0; i--){
                var item = result.media[i];
                if(this.lastPosts.find(
                    o => o.id === item.shortcode) == null)
                {
                    await insta.scrapePostPage(item.shortcode).then(
                    (data) => {
                        var postData = this.createPostData(
                            item.shortcode, data);
                        if(!firstTime) this.newData(postData.value);
                        this.lastPosts.unshift(postData);
                    }).catch(() => {
                        console.log("Instagram scraping post page failed.");
                        this.checkDelay = 10000;
                    });;
                }
            };
        })
        .catch(() => {
            console.log("Instagram scraping tag page failed.");
            this.checkDelay = 10000; 
        });
        while(this.lastPosts.length > 10)
        {
            this.lastPosts.pop();
        }
        setTimeout(()=>{ this.checkData(false); }, this.checkDelay);
    }

    createPostData(shortcode, data)
    {
        return {
        "id" : shortcode,
        "value" : {
            "user": data.owner.username,
            "text": data.edge_media_to_caption.edges[0].node.text,
            "timestamp": data.taken_at_timestamp,
            "image": data.display_url
        }};
    }
}

module.exports = Instagram