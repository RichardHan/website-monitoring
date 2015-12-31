"use strict"

var Monitor = require('./lib/monitor.js');
var websites = require('./websites');
var http = require('http');
var events = require('./events');
var urls = [];
var monitors = [];

/*
   Loop over all websites and create a Monitor instance for each one.
*/
websites.forEach(function (website) {
    
    var monitor = new Monitor({
        website: website.url,        
        interval: website.interval,
        bodyContain: website.bodyContain
    });
    
    monitor.on('error', events.onError);
    monitor.on('stop', events.onStop);
    monitor.on('down', events.onDown);
    monitor.on('up', events.onUp);
    
    urls.push(website.url);
    monitors.push(monitor);
});
