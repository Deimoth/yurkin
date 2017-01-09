var http = require('http');
var db = require('./db');

var server = http.createServer(function(req, res) {
  db.initDB();
  res.writeHead(200);
  res.end('it works!');
});

server.listen(8080);
