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
    wodTable.empty();
    if (wods.length > 0) {
      wods.forEach(function(wod) {
        var wodString = '<tr class="separator"><td><label>' + wod.date + '</label></td><td><textarea type="text" rows="20" cols="60" readonly>' + wod.content + '</textarea></td></tr>';
        if (needComment) {
          wodString += '<tr> \
                          <td></td> \
                          <td> \
                            <label>Комментарий</label> \
                          </td> \
                        </tr> \
                        <tr> \
                          <td></td> \
                          <td> \
                            <textarea type="text" rows="5" cols="60" readonly>' + wod.comment + '</textarea> \
                          </td> \
                        </tr>';
        } else {
          wodString += '</td>'
        }
        wodString += '</tr>';
        wodTable.append(wodString);
      })
    } else {
      wodTable.append('<tr><td colspan="2"><label><h2>Нет записей</h2></label></td></tr>');
    }
  })
}

var commonAfterLoad = function() {
  var userName = $("#login_user_name")[0];
  if (userName && localStorage['user.fullname']) {
    userName.innerHTML = localStorage['user.fullname'];
  }
}

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

$(window).load(function(){
  scrollBoxSetHeight();
})

$(window).resize(function(){
  scrollBoxSetHeight();
})

var scrollBoxSetHeight = function() {
  var calHeigh = $(window).innerHeight() - $('.header').outerHeight() - $('.page_title').outerHeight() - 130;
  $('.scroll-box').css('height', calHeigh + 'px')
}