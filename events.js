"use strict";
var Logger = require('./lib/logger.js');
var mail_config = require('./mail_config.json');
var mailer = require('./mailer');
var moment = require('moment');

/*
    Handles events emitted when a websites stop being monitored

    @param - (String) website - website url
*/
function onStop(website) {
    
    var stopMessage = website + ' monitor has stopped';
    logger.info(stopMessage);
    
    mailer({
        from: mail_config.from,
        to: mail_config.to,
        subject: stopMessage,
        body: '<p>' + website + ' is no longer being minitored.</p>'
    },
    function (error, res) {
        if (error) {
            Logger.error('Failed to send email. ' + error.message);
        }
        else {
            Logger.info(res.message);
        }
    });
}

/*
    Handles events emitted when a website is down

    @param - (Object) res - response object return by the Node Monitor object
*/
function onDown(res) {
    var downMessage = res.website + ' is down.';
    
    Logger.error(moment().format() + " " + downMessage 
        + " (" + res.responseTime + " ms)" + ' Message:' + res.statusMessage);    
    
    if (res.isEnableEmail == true) {
        Logger.info('[isEnableEmail = true] , Send email to ' + mail_config.to);
        var msg = '';
        
        msg += '<p>Time: ' + res.time;
        msg += '</p><p>Website: ' + res.website;
        msg += '</p><p>Message: ' + res.statusMessage + '</p>';
        
        mailer({
            from: mail_config.from,
            to: mail_config.to,
            subject: downMessage,
            body: msg
        },
        function (error, res) {
            if (error) {
                Logger.error('Failed to send email. ' + error.message);
            }
            else {
                Logger.info(res.message);
            }
        });
    }
}

/*
    Handles events emitted when aa error occurs

    @param - (String) msg - response message
*/
function onError(msg) {
    Logger.error(msg);
}

/*
    Handles events emitted when aa error occurs

    @param - (String) msg - response message
*/
function onUp(res) {    
    Logger.info(moment().format() + ' ' + res.website + ' is up.', "(" + res.responseTime + " ms)");    
}

module.exports.onStop = onStop;
module.exports.onDown = onDown;
module.exports.onError = onError;
module.exports.onUp = onUp;

