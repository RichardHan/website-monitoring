"use strict";
var config = require('./config.json');
var mailer = require('./mailer');
var winston = require('winston');
winston.add(winston.transports.File, { filename: config.logFile });

/*
    Handles events emitted when a websites stop being monitored

    @param - (String) website - website url
*/
function onStop(website) {
    
    var stopMessage = website + ' monitor has stopped';
    winston.info(stopMessage);

    mailer({
        from: config.from,
        to: config.to,
        subject: stopMessage,
        body: '<p>' + website + ' is no longer being minitored.</p>'
    },    
    function (error, res) {
        if (error) {
            winston.error('Failed to send email. ' + error.message);
        }
        else {
            winston.info(res.message);            
        }
    });
}

/*
    Handles events emitted when a website is down

    @param - (Object) res - response object return by the Node Monitor object
*/
function onDown(res) {
    
    var downMessage = res.website + ' is down';
    winston.error(downMessage);

    var msg = '';
    
    msg += '<p>Time: ' + res.time;
    msg += '</p><p>Website: ' + res.website;
    msg += '</p><p>Message: ' + res.statusMessage + '</p>';    

    mailer({
        from: config.from,
        to: config.to,
        subject: downMessage,
        body: msg
    },
    function (error, res) {
        if (error) {
            winston.error('Failed to send email. ' + error.message);            
        }
        else {
            winston.info(res.message);            
        }
    });
}

/*
    Handles events emitted when aa error occurs

    @param - (String) msg - response message
*/
function onError(msg) {
    winston.error(msg);
}

/*
    Handles events emitted when aa error occurs

    @param - (String) msg - response message
*/
function onUp(res) {
    winston.info(res.website + ' is up.');
}

module.exports.onStop = onStop;
module.exports.onDown = onDown;
module.exports.onError = onError;
module.exports.onUp = onUp;

