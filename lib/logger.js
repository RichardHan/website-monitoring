var fs = require('fs-extra');
var config = require('../app_config.json');
var winston = require('winston');
winston.emitErrs = true;

fs.createFile(config.logFile.name, function (err) {
    if (err !== undefined) {
        console.log(err);
    }
});

var logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        }),
    ],
    exitOnError: false
});

if (config.logFile.applyDailyRotate == true) {
    logger.add(require('winston-daily-rotate-file'), {
        level: config.logLevel,
        filename: config.logFile.name,
        handleExceptions: true,
        json: true,
        maxsize: config.logFile.maxSize,
        colorize: false
    });
}
else {
    logger.add(winston.transports.File, {
        level: config.logLevel,
        filename: config.logFile.name,
        handleExceptions: true,
        json: true,
        maxsize: config.logFile.maxSize,
        colorize: false
    });    
}

module.exports = logger;
module.exports.stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
};