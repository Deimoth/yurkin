var logout = function() {
  localStorage.removeItem('user.login');
  localStorage.removeItem('user.id');
  localStorage.removeItem('user.admin');
  doGet('/logout', function(result) {
    window.location.href = '/login';
  })
}

var getUsers = function(cb) {
  doGet('/getUsers', function(users) {
    if (users) {
      return cb(users);
    }
  })
}

// period - last N days
var getWods(userId, period, cb) {
  if (userId == null || period == null) {
    return [];
  }
  var params = 'userId=' + userId +
    '&period=' + period;
  doPost('/getWods', params, function(wods) {
    return cb(wods);
  })
}
