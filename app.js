var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var dbService = require('./db');
var db = dbService.getDB();
var users = dbService.getUsers(db);
var hash = require('./pass').hash;

// config
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('views'));

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'top secret'
}));

// Session-persisted message middleware
app.use(function(req, res, next){
  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
});

function authenticate(name, pass, fn) {
  if (!module.parent) console.log('authenticating %s', name);
  var user = users.find({'name': name});
  if (!user) {
    throw 'cannot find user';
  }
  var hash = hash(pass);
  if (hash === user.password) {
    console.log('$s authenticated successfully', user);
    fn();
  } else {
    throw 'invalid password';
  }
}

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

app.get('/', function(req, res){
  res.redirect('/login');
});

app.get('/restricted', restrict, function(req, res){
  res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
});

app.get('/logout', function(req, res){
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(function(){
    res.redirect('/');
  });
});

app.get('/login', function(req, res){
  res.render('login');
});

app.get('/admin', function(req, res) {
  res.render('admin');
})

app.post('/login', function(req, res){
  authenticate(req.body.username, req.body.password, function(err, user){
    if (user) {
      // Regenerate session when signing in
      // to prevent fixation
      req.session.regenerate(function(){
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = user;
        req.session.success = 'Authenticated as ' + user.name
          + ' click to <a href="/logout">logout</a>. '
          + ' You may now access <a href="/restricted">/restricted</a>.';
        res.redirect('back');
      });
    } else {
      req.session.error = 'Authentication failed, please check your '
        + ' username and password.';
      res.redirect('/login');
    }
  });
});

app.get('/firstInit', function(req, res) {
  dbService.insertUser(db, 'yurkin', 'yurkin', true);
})

app.listen(3000, function () {
  console.log('Yurkin started on port 3000');
});
