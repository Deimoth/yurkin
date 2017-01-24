var sqlite3 = require('sqlite3').verbose();
var dbfile = 'mydb.db';

// first initialize of database, use if needed
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

// create user function. params:
// fullname, login (UNIQUE), password, admin (1/0) - fields
// cb - callback function
// id will be generated automatically
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

// create WOD function. params:
// date, userId, content, comment, trainerId (NOT USED NOW, MAYBE LATER..) - fields
// cb - callback function
// id will be generated automatically
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

// get all users
// cb - callback function
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

// simple authorization. params:
// login
// password - as HASH
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
