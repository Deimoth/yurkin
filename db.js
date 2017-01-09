var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mydb.db');

var init = function() {
  db.serialize(function() {
    db.run("CREATE TABLE if not exists USERS (fullname TEXT, login TEXT, password TEXT, admin INTEGER)");
    db.run("CREATE TABLE if not exists WODS (date INTEGER, userid INTEGER, content BLOB, comment BLOB, trainerid INTEGER)")
  });
}

var close = function() {
  db.close();
}

exports.initDB = function() {
  init();
}

exports.closeDB = function() {
  close();
}

exports.getUserByLogin = function(login) {
  if (!login) {
    return;
  }
  var users;
  db.all("SELECT from USERS where login = " + login, function(err, row) {
    if (row) {
      for (var i = 0; i < row.length; i++) {
        users.push(row[i]);
      }
    }
  })
  return users;
}
