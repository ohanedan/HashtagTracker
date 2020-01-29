# HashtagTracker
## Welcome
**HashtagTracker** is tracking hashtags on social platforms(Twitter, Instagram etc.) and serving data on a socket real time. With this repository, you can track any hashtag on social platforms.

## Usage
1. set config file
2. start server
3. using any tcp client for connecting or design your own interface and show the data you have acquired over tcp.

## Available Sources
* Twitter (need twitter api)
* Instagram

You can add any platform you want. Just create new class that extends ISource and send data with ISource's newData function.

## Client Messages
* {"key":"password", "value": "YOUR socketAuthKey"} : After connecting to the socket, you must send this message for verification before the timeout period you specified.
* {"key":"close"} : Send this message to close the socket connection cleanly.

## Config Settings

    tcpHost: tcp host to listen
    
    tcpPort: tcp port
    
    socketAuthKey: password to be used during login for data security
    
    socketLoginTimeout : login timeout
    
    sources: You can set the hashtags and platforms you want to follow in this array.
    
## Example Sources Array
    sources: [
        new Twitter("HASHTAG", {
            consumer_key: 'YOUR TWITTER API CONSUMER KEY',
            consumer_secret: 'YOUR TWITTER API CONSUMER SECRET',
            access_token_key: 'YOUR TWITTER API ACCESS TOKEN',
            access_token_secret: 'YOUR TWITTER API ACCESS TOKEN SECRET'
        }),
        new Instagram("HASHTAG", 1000)
    ]

## Example Output
    {"platform":"Instagram","hashtag":"galatasaray","data":{"user":"SOME USER","text":"Bu gölü atabilecek arkadaşını              etiketle.\n\n#millitakım #messi #neymar #mbappe #zlatanibrahimovic #hakançalhanoğlu #grizmann #cengizunder #galatasaray #ultraslan #gfb #fenerbahçe #beşiktaş #çarşı #falcao #muslera #kaanayhan #türkiye","timestamp":1580328451,"image":"there will be a link here"},"type":"data"}

## Used Packages
* [node-twitter](https://github.com/desmondmorris/node-twitter)
* [instagram-hashtag-scrapper](https://github.com/estebansanti/instagram-hashtag-scrapper)

## Copyright and License
**HashtagTracker** is licensed under the MIT license.
