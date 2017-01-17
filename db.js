var sqlite3 = require('sqlite3').verbose();
var dbfile = 'mydb.db';

var init = function() {
  var db = new sqlite3.Database(dbfile);
  db.serialize(function() {
    db.run("CREATE TABLE if not exists USERS (id INTEGER, fullname TEXT, login TEXT, password TEXT, admin INTEGER)");
    db.run("CREATE TABLE if not exists WODS (id INTEGER, date INTEGER, userid INTEGER, content BLOB, comment BLOB, trainerid INTEGER)")
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
  var query = "INSERT into USERS (fullname, login, password, admin, id) values ('" + fullname + "','" + login + "','" + password + "'," + admin + ", (SELECT max(id) from USERS) + 1)";
  console.log(query);
  db.run(query, function(err, row) {
    if (err) {
      if (err.toString().indexOf('UNIQUE constraint failed: USERS.login') >= 0) {
        err = 'Ошибка: Неуникальное имя пользователя';
      }
      console.log(err);
      return cb(err);
    }
    db.close();
    return cb("OK");
  })
}

exports.createWod = function(date, userId, content, comment, trainerId, cb) {
  var db = new sqlite3.Database(dbfile);
  var query = "INSERT into WODS (date, userid, content, comment, trainerid, id) values ('" + date + "'," + userId + ",'" + content + "','" + comment + "'," + trainerId + ", (SELECT max(id) from WODS) + 1)"
  console.log(query);
  db.run(query, function(err, row) {
    if (err) {
      console.log(err);
      return cb(err);
    }
    db.close();
    return cb("OK");
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

exports.login = function(login, password, cb) {
  var db = new sqlite3.Database(dbfile);
  var query = "SELECT * from USERS where login = '" + login + "' and password = '" + password + "'";
  db.all(query, function(err, rows) {
    var res;
    var error;
    var user;
    if (err) {
      res = false;
      error = err;
    }
    if (rows && rows.length == 1) {
      res = true;
      user = rows[0];
    } else {
      res = false;
      error = "Wrong login or password";
    }
    var result = {
      'result': res,
      'error': error,
      'user': user
    }
    return cb(result);
  });
}
