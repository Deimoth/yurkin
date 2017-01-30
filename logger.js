var log4js = require('log4js');

log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/all.log'), 'default');

var defaultLoggingLevel = 'ALL';

exports.getLogger = function(loggingLevel) {
  loggingLevel = loggingLevel || defaultLoggingLevel;
  var logger = log4js.getLogger('default');
  logger.setLevel(loggingLevel);
  return logger;
}
