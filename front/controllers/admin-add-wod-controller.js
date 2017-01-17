var afterLoad = function() {
  var usersList = $("select[id='users_list']")[0];
  getUsers(function(users) {
    var list = JSON.parse(users);
    for (var i = 0; i < list.length; i++) {
      usersList.options[i] = new Option(list[i].fullname, list[i].id);
    }
  })
}

var addWod = function() {
  var userIndex = $("select[id='users_list']")[0].selectedIndex;
  var userId = $("select[id='users_list']")[0].options[userIndex].value * 1;
  var date = $("input[id='date']")[0].value;
  var content = $("textarea[id='wod_content']")[0].value;
  var comment = $("textarea[id='wod_comment']")[0].value;
  var params = 'userId=' + userId * 1 +
    '&date=' + date +
    '&content=' + content +
    '&comment=' + comment +
    '&trainerid=' + localStorage['user.id'] * 1;
  doPost('/createWod', params, function(result) {
    if (result == "OK") {
      result_message = 'Добавлен WOD';
      userIndex = 0;
      content = '';
      comment = '';
    } else {
      result_message = result;
    }
    $("span[id='result_message']")[0].innerHTML = result_message;
  })
}

window.onload = function() {
  afterLoad();
}
