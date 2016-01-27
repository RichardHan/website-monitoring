var http = require('http');
var https = require('https');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var url = require('url');
var moment = require('moment');
var config = require('../app_config.json');
var statusCodes = http.STATUS_CODES;
/* Unable to verify leaf signature issue - http://stackoverflow.com/questions/20082893/unable-to-verify-leaf-signature */
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

/*
    Monitor Constructor
*/
function Monitor(opts) {
    // default http request method
    this.method = 'GET';
    
    // holds website to be monitored
    this.website = '';
    
    // ping intervals in minutes
    this.interval = config.pingIntervalsInMinutes;
    
    // isEnableMail
    this.isEnableEmail = config.isEnableEmail;
    
    // interval handler
    this.handle = null;
    
    this.lastTriggerTime = new Date;
    
    // initialize the app
    this.init(opts);
}

/*
    Inherit from EventEmitter
*/
util.inherits(Monitor, EventEmitter);

Monitor.prototype.init = function (opts) {
    // opts.timeout ensures backward compatibility
    var interval = opts.interval || opts.timeout || 15;
    var website = opts.website;
    
    if (!website) {
        return this.emit('error', { msg: 'You did not specify a website to monitor' });
    }
    
    this.method = opts.method || this.method;
    
    this.website = website;
    
    this.bodyContain = opts.bodyContain;
    
    this.interval = (interval * (60 * 1000));
    
    this.isEnableEmail = this.isEnableEmail;
    
    this.isAlive = false;
    
    // start monitoring
    this.start();
    
    return this;
};

Monitor.prototype.start = function () {
    var self = this;
    
    console.log("Monitoring: " + self.website);
    console.log("Start Time: " + moment().format());
    console.log("Return body must contain: " + self.bodyContain);
    console.log("");
    
    // create an interval for pings
    self.handle = setInterval(function () {
        self.ping();
    }, self.interval);
    
    return self;
};

Monitor.prototype.stop = function () {
    clearInterval(this.handle);
    this.handle = null;
    
    this.emit('stop', this.website);
    
    return this;
};

Monitor.prototype.ping = function () {
    var self = this;
    var currentTime = Date.now();
    var req;
    var options = url.parse(self.website);
    
    options.method = this.method;
    if (self.website.indexOf('https:') === 0) {
        var start = new Date;
        req = https.request(options, function (res) {
            var responseTime = new Date- start;
            res.setEncoding('utf8');
            if (res.statusCode === 200) {
                var body = '';
                res.on('data', function (data) {
                    body += data;
                    // Too much data, kill the connection!
                    // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                    if (body.length > 1e6)
                        request.connection.destroy();
                });
                res.on('end', function () {
                    // Website is up                    
                    self.isOk({
                        body: body,
                        bodyContain: self.bodyContain,
                        website: self.website,
                        responseTime: responseTime
                    });
                });
            }
            else {
                // No error but website not ok
                self.isNotOk(res.statusCode, responseTime);
            }
        });
    }
    else {
        var start = new Date;
        req = http.request(options, function (res) {
            var responseTime = new Date- start;
            if (res.statusCode === 200) {
                var body = '';
                res.on('data', function (data) {
                    body += data;
                    // Too much data, kill the connection!
                    // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                    if (body.length > 1e6)
                        request.connection.destroy();
                });
                res.on('end', function () {
                    // Website is up                    
                    self.isOk({
                        body: body,
                        bodyContain: self.bodyContain,
                        website: self.website,
                        responseTime: responseTime
                    });
                });
            }
            else {
                // No error but website not ok
                self.isNotOk(res.statusCode, responseTime);
            }
        });
    }
    
    req.on('error', function (err) {
        var data = self.responseData({
            time: moment().format(),
            statusCode: 404,
            website: self.website,
            msg: statusCodes[404 + ''],
            isAlive: false
        });
        self.emit('error', data);
    });
    
    req.end();
    
    return this;
};

Monitor.prototype.isOk = function (obj) {
    if (obj.body.indexOf(obj.bodyContain) > 0) {
        var data = this.responseData({
            statusCode: 200,
            msg: 'OK',
            body: obj.body,
            responseTime: obj.responseTime,
            isAlive: true
        });
        this.emit('up', data);
        return this;
    }
    else {
        var msg = 'Response body does not contains "' + obj.bodyContain + '"';
        var data = this.responseData({
            statusCode: 200,
            msg: msg,
            responseTime: obj.responseTime,
            isAlive: false
        });
        
        this.emit('down', data);
    }
};

Monitor.prototype.isNotOk = function (statusCode, responseTime) {
    var data = this.responseData({
        statusCode: statusCode,
        msg: statusCodes[statusCode + ''],
        responseTime: responseTime,
        status: this.status,
        isAlive: false
    });
    
    this.emit('down', data);
    
    return this;
};

Monitor.prototype.responseData = function (obj) {
    
    var data = {
        website: this.website,
        time: moment().format(),
        statusCode: obj.statusCode,
        statusMessage: obj.msg,
        body: obj.body,
        isEnableEmail: this.isEnableEmail,
        responseTime: obj.responseTime,
        isAlive: obj.isAlive
    };
    
    return data;
};

Monitor.prototype.getFormatedDate = function (time) {
    var currentDate = new Date(time);
    
    currentDate = currentDate.toISOString();
    currentDate = currentDate.replace(/T/, ' ');
    currentDate = currentDate.replace(/\..+/, '');
    
    return currentDate;
};

module.exports = Monitor;