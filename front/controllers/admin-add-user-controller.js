var addUser = function() {
  $("span[id='error_message']")[0].class = '';
  $("span[id='error_message']")[0].innerHTML = '';
  var fullname = $('#user_fullname')[0].value;
  var login = $('#user_login')[0].value;
  var password = $('#user_password')[0].value;
  var admin = $('#user_admin')[0].checked;
  if (fullname.length == 0 || login.length == 0 || password.length == 0) {
    $('.message-block').show();
    $('.message-block').addClass('message-error');
    $("span[id='error_message']")[0].class = 'error';
    $("span[id='error_message']")[0].innerHTML = "Какое-то поле не заполнено, не надо так"
    return;
  }
  var params = 'fullname=' + fullname +
    '&login=' + login +
    '&password=' + easyHash(password) +
    '&admin=' + (admin ? 1 : 0);
  doPost('/createUser', params, function(res) {
    var result_message;
    if (res == "OK") {
      result_message = 'Добавлен пользователь: ' + login + '/' + password;
      $('#user_fullname')[0].value = '';
      $('#user_login')[0].value = '';
      $('#user_password')[0].value = '';
      $('#user_admin')[0].checked = false;
    } else {
      result_message = res;
    }

    $('.message-block').show();
    $('.message-block').addClass('message-success');
    $("span[id='result_message']")[0].innerHTML = result_message;
  })
}

var closeMessage = function() {
  $('.message-block').removeClass('message-success');
  $('.message-block').removeClass('message-error');
  $('.message-block').hide();
}

var generatePassword = function() {
  var password = $('#user_password')[0];
  var symbols = ['1','2','3','4','5','6','7','8','9','0','q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m'];
  var string = '';
  for (var i = 0; i < 8; i++) {
    var index = getRandomInt(0, symbols.length);
    string += symbols[index];
  }
  password.value = string;
}

window.onload = function() {
  commonAfterLoad();
}
