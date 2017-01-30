var log4js = require('log4js');
var fs = require('fs');
var path = 'all.log';

var defaultLoggingLevel = 'ALL';

exports.getLogger = function(loggingLevel) {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, '');
  }
  log4js.loadAppender('file');
  log4js.addAppender(log4js.appenders.file(path), 'default');
  loggingLevel = loggingLevel || defaultLoggingLevel;
  var logger = log4js.getLogger('default');
  logger.setLevel(loggingLevel);
  return logger;
}
