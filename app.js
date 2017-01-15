var express = require('express');
var app = express();
var db = require('./db');
var bodyParser = require('body-parser');
var session = require('express-session');

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use('/front', express.static('front'));
app.use(session({
  'secret': 'top_secret',
  'resave': true,
  'saveUninitialized': true
}));

app.get('/', function(req, res) {
  res.redirect('/mainpage');
})

app.get('/login', function(req, res) {
  if (!req.session.user) {
    res.sendFile(__dirname + '/front/login.html');
  } else {
    res.redirect('/mainpage');
  }
})

app.get('/mainpage', function(req, res) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    res.sendFile(__dirname + '/front/mainpage.html');
  }
})

app.post('/login', function(req, res) {
  db.login(req.body.login, req.body.password, function(result) {
    if (result.result) {
      req.session.user = result.user;
    }
    res.send(result);
  });
})

app.get('/logout', function(req, res) {
  delete req.session.user;
  res.sendFile(__dirname + '/front/login.html');
})

app.post('/createUser', function(req, res) {
  db.createUser(req.body.fullname, req.body.login, req.body.password, req.body.admin, function(result) {
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
