var login = function(login, password) {
  $('#result_message').innerHTML = '';
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
      localStorage.setItem('user.fullname', result.user.fullname);
      if (result.user.admin) {
        window.location.href = '/admin';
      } else {
        window.location.href = '/mainpage';
      }
    } else {
      $('.message-block').show();
      $('.message-block').addClass('message-error');
      $('#result_message').text(result.error);
    }
  })
}

$(document).keypress(function(e) {
    if(e.which == 13) {
        login();
    }
});

var closeMessage = function() {
  $('.message-block').removeClass('message-error');
  $('.message-block').hide();
}