"use strict";
var Logger = require('./lib/logger.js');
var mail_config = require('./mail_config.json');
var mailer = require('./mailer');
var moment = require('moment');
var isSendEmailStatus = {};

/*
    Handles events emitted when a websites stop being monitored

    @param - (String) website - website url
*/
function onStop(website) {
    var stopMessage = website + ' monitor has stopped';
    logger.info(stopMessage);
    if (res.isEnableEmail == true && !isSendEmailStatus[res.website] === true) {
        isSendEmailStatus[website] = true;
        sendByMailer(stopMessage, '<p>' + website + ' is no longer being minitored.</p>');
    }
}

/*
    Handles events emitted when a website is down

    @param - (Object) res - response object return by the Node Monitor object
*/
function onDown(res) {
    var downMessage = res.website + ' is down.';
    Logger.error(downMessage + "(" + res.responseTime + " ms)" + ' Reason: ' + res.statusMessage);
    if (res.isEnableEmail == true && !isSendEmailStatus[res.website] === true) {
        isSendEmailStatus[res.website] = true;
        Logger.info('[isEnableEmail = true] , Send email to ' + mail_config.to);
        var msg = '';
        msg += '<p>Time: ' + res.time;
        msg += '</p><p>Website: ' + res.website;
        msg += '</p><p>Message: ' + res.statusMessage + '</p>';
        sendByMailer(downMessage, msg);
    }
}

/*
    Handles events emitted when aa error occurs

    @param - (Object) res - response object return by the Node Monitor object
*/
function onError(res) {
    var downMessage = res.website + ' an error has occurs.';
    Logger.error(downMessage + ' HTTP Messages:' + res.statusMessage);
    
    if (res.isEnableEmail == true && !isSendEmailStatus[res.website] === true) {
        isSendEmailStatus[res.website] = true;
        Logger.info('[isEnableEmail = true] , Send email to ' + mail_config.to);
        var msg = '';
        
        msg += '<p>Time: ' + res.time;
        msg += '</p><p>Website: ' + res.website;
        msg += '</p><p>Message: ' + res.statusMessage + '</p>';
        
        sendByMailer(downMessage, msg);
    }
}

/*
    Handles events emitted when aa error occurs

    @param - (Object) res - response object return by the Node Monitor object
*/
function onUp(res) {
    if (res.isEnableEmail == true && isSendEmailStatus[res.website] === true) {
        var msg = '';
        msg += '<p>Time: ' + res.time;
        msg += '</p><p>Website: ' + res.website;
        msg += '</p><p>Message: ' + "The service is working properly." + '</p>';
        sendByMailer(res.website + " service has recovered." , msg);
    }
    isSendEmailStatus[res.website] = false;
    Logger.info(res.website + ' is up.', "(" + res.responseTime + " ms)");
}

/*
 *  Handlers send email behavior.
 */
function sendByMailer(subjectStr, bodyStr) {
    mailer({
        from: mail_config.from,
        to: mail_config.to,
        subject: subjectStr,
        body: bodyStr
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

module.exports.onStop = onStop;
module.exports.onDown = onDown;
module.exports.onError = onError;
module.exports.onUp = onUp;

