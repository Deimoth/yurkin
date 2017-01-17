var logout = function() {
  localStorage.removeItem('user.login');
  localStorage.removeItem('user.id');
  localStorage.removeItem('user.admin');
  doGet('/logout', function(result) {
    window.location.href = '/login';
  })
}
