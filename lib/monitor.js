var http = require('http');
var https = require('https');
var fs = require('fs');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var url = require('url');
var statusCodes = http.STATUS_CODES;


/*
    Monitor Constructor
*/
function Monitor(opts) {
  // default http request method
  this.method = 'GET';

  // holds website to be monitored
  this.website = '';

  // ping intervals in minutes
  this.interval = 15;

  // interval handler
  this.handle = null;

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

  // start monitoring
  this.start();

  return this;
};

Monitor.prototype.start = function () {
  var self = this;
  var time = Date.now();

  console.log("Monitoring: " + self.website);
  console.log("Start Time: " + self.getFormatedDate(time));
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
    req = https.request(options, function (res) {
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
          self.isOk(body, self.bodyContain, self.website);
        });
      }
      else {
        // No error but website not ok
        self.isNotOk(res.statusCode);
      }
    });
  }
  else {
    req = http.request(options, function (res) {
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
          self.isOk(body, self.bodyContain, self.website);
        });
      }
      else {
        // No error but website not ok
        self.isNotOk(res.statusCode);
      }
    });
  }

  req.on('error', function (err) {
    var data = self.responseData(404, statusCodes[404 + '']);
    self.emit('error', data);
  });

  req.end();

  return this;
};

Monitor.prototype.isOk = function (body, bodyContain, website) {
  if (body.indexOf(bodyContain) > 0) {
    var data = this.responseData(200, 'OK', body);
    this.emit('up', data);
    return this;
  }
  else {
    var msg = website + ' did not contains "' + bodyContain + '"';
    var data = this.responseData(200, msg);
    this.emit('down', data);
  }
};

Monitor.prototype.isNotOk = function (statusCode) {
  var msg = statusCodes[statusCode + ''];
  var data = this.responseData(statusCode, msg);

  this.emit('down', data);

  return this;
};

Monitor.prototype.responseData = function (statusCode, msg, body) {

  var data = {
    website: this.website,
    time: Date.now(),
    statusCode: statusCode,
    statusMessage: msg,
    body: body
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