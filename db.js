exports.getDB = function() {
  var db = new loki('db.json');
  return db;
}

exports.getUsers = function(db) {
  checkDatabase(db);
  var users = db.users;
  return users;
}

exports.insertUser = function(db, userName, userPass, isAdmin) {
  checkDatabase(db);

}

var checkDatabase = function(db) {
  if (!db) {
    throw ('ERROR! No database defined');
  }
}
