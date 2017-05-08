var addMove = function() {
  $("span[id='error_message']")[0].class = '';
  $("span[id='error_message']")[0].innerHTML = '';
  var moveName = $('#move_name')[0].value;
  if (moveName.length == 0) {
    $('.message-block').show();
    $('.message-block').addClass('message-error');
    $("span[id='error_message']")[0].class = 'error';
    $("span[id='error_message']")[0].innerHTML = "Какое-то поле не заполнено, не надо так"
    return;
  }
  var params = 'name=' + moveName;
  doPost('/createMove', params, function(res) {
    var result_message;
    if (res == "OK") {
      result_message = 'Добавлено движение: ' + moveName;
      $('#move_name')[0].value = '';
    } else {
      result_message = res;
    }

    $('.message-block').show();
    $('.message-block').addClass('message-success');
    $("span[id='result_message']")[0].innerHTML = result_message;
  })
}
