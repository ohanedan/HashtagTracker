var net = require('net');
var winston = require("winston");
const config = require("./config");

const logger = winston.createLogger({
    format: winston.format.combine(
      winston.format.simple(),
      winston.format.colorize()
    ),
    transports: [
      new winston.transports.Console({ format: winston.format.simple() })
    ]
});

if(config.sources.length == 0)
{
    throw "you need add at least one source in config";
}

var server = net.createServer();

server.listen(config.tcpPort, config.tcpHost, () => {
    if(config.tcpHost == "")
    {
        logger.info('Server is running on port ' + config.tcpPort +'.');
    }
    else
    {
        logger.info('Server is running on ' + config.tcpHost + 
                                    ', port ' + config.tcpPort +'.');
    }
});

server.on('error', function(err) {
    logger.error("Server Error: " + err);
});

const connectedSockets = new Set();

connectedSockets.broadcast = function(data, except) {
    for (let sock of this) {
        if (sock !== except) {
            sock.write(data + "\r\n");
        }
    }
}

server.on('connection', function(sock) {
    var sockAddress = sock.address().address;
    logger.info("A new socket connection on " + sockAddress
                                         + ". Waiting for password.");  

    sock.on('data', function(data) {
        data = data.toString().replace(/\r?\n|\r/g, "");
        if(data == "") return;
        var obj;
        try {
            obj = JSON.parse(data);
        } catch {
            sendSystemMessageToSocket(sock, "incorrect message format.");
            logger.warn("[" + sockAddress + "] parse data error. Data: "
                                                                     + data);
            return;
        }
        parseIncomingData(sock, obj);
    });

    setTimeout(() => {
        if(!connectedSockets.has(sock))
        {
            logger.warn("[" + sockAddress + "] didn't login in "
            + config.socketLoginTimeout + " seconds.");
            sendSystemMessageToSocket(sock, "goodbye my friend!");
            sock.destroy();
        }
    }, config.socketLoginTimeout*1000);
    
    sock.on('error', function(err) {
        logger.warn("Socket Error: " + err);
        if(connectedSockets.has(sock))
        {
            connectedSockets.delete(sock);
        }
    });
});

function parseIncomingData(sock, data)
{
    var sockAddress = sock.address().address;
    if(!data.hasOwnProperty('key') || !data.hasOwnProperty('value'))
    {
        sendSystemMessageToSocket(
                    "data must have properties which key and value");
        logger.warn("[" + sockAddress + "] sent data without key/value. Data"
                                                    + JSON.stringify(data));
        return;
    }
    var key = data.key;
    var value = data.value;
    if(!connectedSockets.has(sock) && key != "password")
    {
        sendSystemMessageToSocket(sock, "who are you?");
        logger.warn("[" + sockAddress + "] sent data before authentication."
                                    + " Data: " + JSON.stringify(data));
        return;
    }
    else if(key == "password" && value == config.socketAuthKey)
    {
        logger.info("[" + sockAddress + "] logged in.");
        connectedSockets.add(sock);
        sendSystemMessageToSocket(sock, "hello, my friend!");
        return;
    }
    if(key == "close")
    {
        connectedSockets.delete(sock);
        sendSystemMessageToSocket(sock, "goodbye my friend!");
        sock.destroy();
        logger.info("[" + sockAddress + "] logged out.");
    }
    else
    {
        sendSystemMessageToSocket(sock, "unknown command.");
        logger.warn("[" + sockAddress + "] sent unknown command."
                                    + " Data: " + JSON.stringify(data));
    }
}

function sendSystemMessageToSocket(sock, message)
{
    var err = {
        "type" : "system",
        "message" : message
    }
    sock.write(JSON.stringify(err) + "\r\n");
}

config.sources.forEach((element) => {
    logger.info("#" + element.hashtag + " is tracking on " + 
                    element.platform + ".");
    element.eventManager.on('data', function(data){
        data.type = "data";
        connectedSockets.broadcast(JSON.stringify(data));
        logger.info("#" + element.hashtag + " has a new post on " 
                                                    + data.platform);
    });
});