var hash = require('./pass').hash;
var loki = require('lokijs');

exports.getDB = function() {
  var db = new loki('db.json');
  console.log('DB init: db.json')
  return db;
}

exports.getUsers = function(db) {
  return getUsers(db);
}

var getUsers = function(db) {
  checkDatabase(db);
  var users = db.users;
  console.log('users: ' + users);
  return users;
}

exports.insertUser = function(db, userName, userPass, isAdmin) {
  checkDatabase(db);
  var users = getUsers(db);
  if (!users) {
    users = db.addCollection('users');
  }
  users.insert({
    'name': userName,
    'password': hash(userPass, null, function(err, hash){}),
    'isAdmin': isAdmin
  })
  console.log('inserted user: ' + userName);
}

var checkDatabase = function(db) {
  if (!db) {
    throw ('ERROR! No database defined');
  }
}
