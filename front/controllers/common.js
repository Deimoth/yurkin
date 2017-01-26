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

var getWods = function(userId, needComment) {
  var params = 'userId=' + userId +
    '&period=7';
  doPost('/getWods', params, function(wods) {
    wods = JSON.parse(wods);
    var wodTable = $('#wod_table tbody');
    if (wods.length > 0) {
      wods.forEach(function(wod) {
        var wodString = '<tr><td>' + wod.date + '</td><td><textarea type="text" rows="20" cols="30" readonly>' + wod.content + '</textarea></td>';
        if (needComment) {
          wodString += '<td><textarea type="text" rows="20" cols="30" readonly>' + wod.comment + '</textarea></td>';
        }
        wodString += '</tr>';
        wodTable.append(wodString);
      })
    } else {
      wodTable.append('<tr><td></td><td>Нет записей</td></tr>');
    }
  })
}

var commonAfterLoad = function() {
  var userName = $("#login_user_name")[0];
  if (userName && localStorage['user.login']) {
    userName.innerHTML = localStorage['user.login'];
  }
}
