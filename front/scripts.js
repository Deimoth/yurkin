var doGet = function(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", theUrl, true);
  xmlHttp.send(null);
}

var doPost = function(theUrl, params, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        callback(xmlHttp.responseText);
  }
  xmlHttp.open("POST", theUrl, true);
  xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlHttp.send(params);
}

var easyHash = function(string) {
  var hash = 0, i, chr, len;
  if (string.length === 0) return hash;
  for (i = 0; i < string.length; i++) {
    chr   = string.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

var addUser = function(fullname, login, password, admin) {
  fullname = fullname || 'admin';
  login = login || 'admin';
  password = login || 'admin';
  admin = admin || 1;
  var params = 'fullname=' + fullname +
    '&login=' + login +
    '&password=' + easyHash(password) +
    '&admin=' + admin;
  doPost('/createUser', params, function(res) {
    if (res) {
      alert(res);
    }
  })
}

var getUsers = function() {
  doGet('/getUsers', function(res) {
    if (res) {
      document.write(res);
    }
  })
}

var login = function(login, password) {
  var login = $("input[id='login_text']")[0].value;
  var password = $("input[id='password_text']")[0].value;
  var params = 'login=' + login + '&password=' + easyHash(password);
  doPost('/login', params, function(result) {
    console.log(result);
    result = JSON.parse(result);
    if (result.result) {
      localStorage.setItem('user.login', result.user.login);
      localStorage.setItem('user.id', result.user.id);
      localStorage.setItem('user.admin', result.user.admin);
      window.location.href = '/mainpage';
    } else {

    }
  })
}

var logout = function() {
  localStorage.removeItem('user.login');
  localStorage.removeItem('user.id');
  localStorage.removeItem('user.admin');
  doGet('/logout', function(result) {
    window.location.href = '/login';
  })
}
