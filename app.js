'use strict';

var express = require("express"),
    multer = require('multer'),
    request = require("request").defaults({ strictSSL: false }),
    parseString = require('xml2js').parseString,
    express = require("express"),
    multer = require('multer'),
    config = require('./config.json');

// START CONFIGURATION HERE.

// Plex Webhook Port 
var port = config.plexWebhookPort;

// ISY Config
var username = config.isyUsername;
var password = config.isyPassword;
var isy_ip = config.isyAddress;

// Actions (Plex Client uuid, play light level, stop level, resume level, pause level)
// Levels range from 0-255
// To get your uuid, run this app and start a movie using your player
// the uuid of your player will be shown in the console log.
function registerClients() {
    config.plexClients.forEach((item) => {
        console.log("Registering Plex Client UUID: " + item.uuid);
        registerPlexClient(item.uuid,
            item.isyNodeName,
            item.playLightLevel,
            item.stopLightLevel,
            item.resumeLightLevel,
            item.pauseLightLevel);
    });
}

// END CONFIGURATION - Shouldn't need to touch anything below this line.

function registerPlexClient(clientId, isyNodeName, playLightLevel, stopLightLevel, resumeLightLevel, pauseLightLevel) {

    var isyNodeKey = nodeNameToAddressMap[isyNodeName];

    var newClient = {};
    newClient[clientId] = {
        "media.pause": () => {
            request(isycmd(isyNodeKey + "/cmd/DON/" + pauseLightLevel));
        },
        "media.stop": () => {
            request(isycmd(isyNodeKey + "/cmd/DON/" + stopLightLevel));
        },
        "media.play": () => {
            request(isycmd(isyNodeKey + "/cmd/DON/" + playLightLevel));
        },
        "media.resume": () => {
            request(isycmd(isyNodeKey + "/cmd/DON/" + resumeLightLevel));
        }
    }

    Object.assign(registeredClients, newClient);
}

var registeredClients = {};
var nodeNameToAddressMap = {};
var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

function isycmd(cmd) {
    return {
        method: 'GET',
        url: isy_ip + '/rest/nodes/' + cmd,
        headers: {
            "Authorization": auth
        }
    }
};

function getISYNodes() {
    request(isycmd(''), (error, response, body) => {
        var nodes = parseString(body, (err, result) => {
            result.nodes.node.forEach((value) => {
                console.log("Registered Node Name: " + value.name[0] + " as Node Id: " + value.address[0]);
                nodeNameToAddressMap[value.name[0]] = value.address[0];
            });
        });
        registerClients();
        app.listen(port, () => {
            console.log("Started on port:" + port);
        });
    });
}

var upload = multer({ dest: '/tmp/' });
var app = express();

app.post("/", upload.single('thumb'), (req, res, next) => {

    if (registeredClients[payload.Player.uuid]) {

        var payload = JSON.parse(req.body.payload);

        if (registeredClients[payload.Player.uuid][payload.event])
            registeredClients[payload.Player.uuid][payload.event]();
    }
    else {
        console.log("Event from unhandled Plex Player uuid: " + payload.Player.uuid + ", event: " + payload.event);
    }

    res.sendStatus("200");
});

// Main entry point
getISYNodes();