var express = require('express');
var app = express();
var db = require('./db');
var bodyParser = require('body-parser');
var session = require('express-session');
var logger = require('./logger').getLogger();

// --- USES
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

// --- CONFIG
var loginFile = __dirname + '/front/views/login.html';
var mainpageFile = __dirname + '/front/views/mainpage.html';
var adminAddWodFile = __dirname + '/front/views/admin/admin-add-wod.html';
var adminAddUserFile = __dirname + '/front/views/admin/admin-add-user.html';
var adminViewWodsFile = __dirname + '/front/views/admin/admin-view-wods.html';
var restrictedFile = __dirname + '/front/views/restricted.html';
var adminAddMoveFile = __dirname + '/front/views/admin/admin-add-move.html';
var defaultPort = 8768;

// --- GETS
app.get('/', function(req, res) {
  res.redirect('/mainpage');
})

app.get('/getUsers', function(req, res) {
  db.getUsers(function(result) {
    res.send(result);
  });
})

app.get('/getMoves', function(req, res) {
  db.getMoves(function(result) {
    res.send(result);
  })
})

app.get('/login', function(req, res) {
  if (!req.session.user) {
    res.sendFile(loginFile);
  } else {
    res.redirect('/mainpage');
  }
})

app.get('/mainpage', function(req, res) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    res.sendFile(mainpageFile);
  }
})

app.get('/logout', function(req, res) {
  req.session.destroy();
  res.sendFile(loginFile);
})

app.get('/admin', function(req, res) {
  if (!req.session.user) {
    res.redirect('/login');
  } else if (req.session.user.admin != 1) {
    res.sendFile(restrictedFile);
  } else {
    res.redirect('/admin/addWod');
  }
})

app.get('/admin/addWod', function(req, res) {
  if (!req.session.user) {
    res.redirect('/login');
  } else if (req.session.user.admin != 1) {
    res.sendFile(restrictedFile);
  } else {
    res.sendFile(adminAddWodFile);
  }
})

app.get('/admin/addUser', function(req, res) {
  if (!req.session.user) {
    res.redirect('/login');
  } else if (req.session.user.admin != 1) {
    res.sendFile(restrictedFile);
  } else {
    res.sendFile(adminAddUserFile);
  }
})

app.get('/admin/viewWods', function(req, res) {
  if (!req.session.user) {
    res.redirect('/login');
  } else if (req.session.user.admin != 1) {
    res.sendFile(restrictedFile);
  } else {
    res.sendFile(adminViewWodsFile);
  }
})

app.get('/admin/addMove', function(req, res) {
  if (!req.session.user) {
    res.redirect('/login');
  } else if (req.session.user.admin != 1) {
    res.sendFile(restrictedFile);
  } else {
    res.sendFile(adminAddMoveFile);
  }
})

app.get('/admin/removeuser', function(req, res) {
  if (!req.session.user) {
    res.sendFile(restrictedFile);
  } else {
    db.removeUser(req.query.login, function(result) {
      res.send(result);
    })
  }
})

app.get('/admin/initialize', function(req, res) {
  db.initDB(function(result) {
    res.send(result);
  })
})

app.get('/admin/initialize/addMoves', function(req, res) {
  db.initDBaddMoves(function(result) {
    res.send(result);
  })
})

// --- POSTS
app.post('/login', function(req, res) {
  db.login(req.body.login, req.body.password, function(result) {
    if (result.result) {
      req.session.user = result.user;
    }
    res.send(result);
  });
})

app.post('/createUser', function(req, res) {
  db.createUser(req.body.fullname, req.body.login, req.body.password, req.body.admin, req.body.active, function(result) {
    if (result) {
      res.send(result);
    }
  });
})

app.post('/createWod', function(req, res) {
  db.createWod(req.body.date, req.body.userId, req.body.content, req.body.comment, req.body.trainerid, function(result) {
    if (result) {
      res.send(result);
    }
  })
})

app.post('/createMove', function(req, res) {
  db.createMove(req.body.name, function(result) {
    if (result) {
      res.send(result);
    }
  })
})

app.post('/getWods', function(req, res) {
  db.getWods(req.body.userId, req.body.period, function (result) {
    if (result) {
      res.send(result);
    }
  })
})

// --- SERVER
try {
  app.listen(defaultPort, function() {
    logger.info('server run on port ' + defaultPort);
  });
} catch (e) {
  logger.error(e);
}
