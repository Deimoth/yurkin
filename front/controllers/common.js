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
