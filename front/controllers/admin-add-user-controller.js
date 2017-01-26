var addUser = function() {
  $("span[id='error_message']")[0].class = '';
  $("span[id='error_message']")[0].innerHTML = '';
  var fullname = $("input[id='user_fullname']")[0].value;
  var login = $("input[id='user_login']")[0].value;
  var password = $("input[id='user_password']")[0].value;
  var admin = $("input[id='user_admin']")[0].checked;
  if (fullname.length == 0 || login.length == 0 || password.length == 0) {
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
      delete fullname;
      delete login;
      delete password;
      admin = false;
    } else {
      result_message = res;
    }
    $("span[id='result_message']")[0].innerHTML = result_message;
  })
}

var generatePassword = function() {
  var password = $("input[id='user_password']")[0];
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
