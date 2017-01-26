var afterLoad = function() {
  var usersList = $("select[id='users_list']")[0];
  getUsers(function(users) {
    var list = JSON.parse(users);
    for (var i = 0; i < list.length; i++) {
      usersList.options[i] = new Option(list[i].fullname + ' (' + list[i].login + ')', list[i].id);
    }
  })
}

var userSelected = function() {
  var userIndex = $('#users_list')[0].selectedIndex;
  var userId = $('#users_list')[0].options[userIndex].value * 1;
  getWods(userId, true);
}

window.onload = function() {
  commonAfterLoad();
  afterLoad();
}
