var afterLoad = function() {
  var userId = localStorage['user.id'];
  if (userId) {
    getWods(userId, true);
  }
}

window.onload = function() {
  commonAfterLoad();
  afterLoad();
}
