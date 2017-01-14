var express = require('express');
var app = express();
var db = require('./db');
var bodyParser = require('body-parser');

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use('/', express.static('front'));

app.get('/', function(req, res) {
  res.redirect('/index.html');
})

app.post('/createUser', function(req, res) {
  var result = db.createUser(req.body.fullname, req.body.login, req.body.password, req.body.admin, function(result) {
    res.send(result);
  });
})

app.get('/getUsers', function(req, res) {
  db.getUsers(function(result) {
    res.send(result);
  });
})

app.listen(8080, function() {
  console.log('it works!');
});
