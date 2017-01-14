var sqlite3 = require('sqlite3').verbose();
var dbfile = 'mydb.db';

var init = function() {
  var db = new sqlite3.Database(dbfile);
  db.serialize(function() {
    db.run("CREATE TABLE if not exists USERS (fullname TEXT, login TEXT, password TEXT, admin INTEGER)");
    db.run("CREATE TABLE if not exists WODS (date INTEGER, userid INTEGER, content BLOB, comment BLOB, trainerid INTEGER)")
  });
}

exports.initDB = function() {
  init();
}

exports.getUserByLogin = function(login, cb) {
  if (!login) {
    return;
  }
  var users;
  db.all("SELECT from USERS where login = " + login, function(err, row) {
    if (row) {
      for (var i = 0; i < row.length; i++) {
        users.push(row[i]);
      }
      return cb(users);
    } else {
      return cb(null);
    }
  })
}

exports.createUser = function(fullname, login, password, admin, cb) {
  var db = new sqlite3.Database(dbfile);
  var query = "INSERT into USERS (fullname, login, password, admin) values ('" + fullname + "','" + login + "','" + password + "'," + admin + ")";
  db.run(query, function(err, row) {
    if (err) {
      return cb(err);
    }
    db.close();
    return cb(row);
  })
}

exports.getUsers = function(cb) {
  var users = [];
  var db = new sqlite3.Database(dbfile);
  db.all("SELECT * FROM USERS", function(err, rows) {
    if (err) {
     return cb(err);
    }
    rows.forEach(function (row) {
      users.push(row);
    });
    db.close();
    return cb(users);
  });
}
