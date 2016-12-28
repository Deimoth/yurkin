var express = require('express'),
    http = require('http'),
    app = express(),
    middleware = require('./middleware')(app, express),
    config = require('./config'),
    log = require('./utils/log')(app, module);

http.createServer(app).listen(config.get('port'), function(){
    log.info('Express server listening on port ' + config.get('port'));
});
