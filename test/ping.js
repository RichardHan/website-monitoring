var Monitor = require('../lib/monitor.js'),
    should = require('should'), 
    website = {website: 'https://www.google.com.tw', interval: 0.2, bodyContain:'html'},
    config = {};
    
describe('Monitor', function() {
    describe('Google Website', function() {
        it('should start monitoring http://www.google.com.tw, interval is 0.2 minute', function(done) {            
            var monitor = new Monitor(website);           
            monitor.interval.should.be.eql(0.2 * 60 * 1000);
            monitor.website.should.be.eql('https://www.google.com.tw'); 
            monitor.bodyContain.should.be.eql('html');
            monitor.stop();
            done();
        });
    }); 
    
    describe('Google Website - without interval parameter', function() {
        it('should start monitoring http://www.google.com.tw, interval is 15 minutes', function(done) {            
            var monitor = new Monitor({website: 'https://www.google.com.tw', bodyContain:'html'});            
            monitor.interval.should.be.eql(15 * 60 * 1000); //default interval is 15 minutes.
            monitor.bodyContain.should.be.eql('html');            
            monitor.stop();
            done();
        });
    });      
});