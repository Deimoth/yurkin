var wod = new WOD('', '', []);

var afterLoad = function() {
  $('#date').val(new Date().toDateInputValue());
  var usersList = $("select[id='users_list']")[0];
  getUsers(function(users) {
    var list = JSON.parse(users);
    for (var i = 0; i < list.length; i++) {
      usersList.options[i] = new Option(list[i].fullname + ' (' + list[i].login + ')', list[i].id);
    }
  })

  doGet('/getMoves', function(moves) {
    var movesList = $("select[id='moves_list']")[0];
    if (moves) {
      var list = JSON.parse(moves);
      for (var i = 0; i < list.length; i++) {
        movesList.options[i] = new Option(list[i].name, list[i].name);
      }
    }
  })
}

var addExersise = function() {
  var moveIdx = $("select[id='moves_list']")[0].selectedIndex;
  var move = $("select[id='moves_list']")[0].options[moveIdx].value;
  var reps = $("input[id='reps']")[0].value;
  var weight = $("input[id='weight']")[0].value;
  var exString = move + ' ' + reps;
  if (weight && weight.length > 0) {
    exString += ' x ' + weight;
  }
  wod.exersises.push(exString);
  refreshWodTextArea();
}

var addWodType = function() {
  var wodTypeIdx = $("select[id='wodTypes_list']")[0].selectedIndex;
  var wodType = $("select[id='wodTypes_list']")[0].options[wodTypeIdx].value;
  wod.type = wodType;
  refreshWodTextArea();
}

var addWodLimit = function() {
  var wodLimit = $("input[id='wodLimit']")[0].value;
  wod.limit = wodLimit;
  refreshWodTextArea();
}

var refreshWodTextArea = function() {
  var parsedWod = '';
  parsedWod += wod.type + ' ' + wod.limit + ' \n';
  wod.exersises.forEach(function(ex) {
    parsedWod += ex + '\n';
  })
  $("textarea[id='wod_content']")[0].value = parsedWod;
}

var addWod = function() {
  $("span[id='error_message']")[0].class = '';
  $("span[id='error_message']")[0].innerHTML = '';
  var userIndex = $("select[id='users_list']")[0].selectedIndex;
  var userId = $("select[id='users_list']")[0].options[userIndex].value * 1;
  var date = $("input[id='date']")[0].value;
  var content = $("textarea[id='wod_content']")[0].value;
  var comment = $("textarea[id='wod_comment']")[0].value;
  $('#addWod_button')[0].disabled = true;
  if (content.length == 0 || date.length == 0) {
    $('.message-block').show();
    $('.message-block').addClass('message-error');
    $("span[id='error_message']")[0].class = 'error';
    $("span[id='error_message']")[0].innerHTML = "Какое-то поле не заполнено, не надо так"
    return;
  }
  var params = 'userId=' + userId * 1 +
    '&date=' + date +
    '&content=' + content +
    '&comment=' + comment +
    '&trainerid=' + localStorage['user.id'] * 1;
  doPost('/createWod', params, function(result) {
    if (result == "OK") {
      result_message = 'Добавлен WOD';
      userIndex = 0;
      $('#wod_content')[0].value = '';
      $('#wod_comment')[0].value = '';
    } else {
      result_message = result;
    }
    $('.message-block').show();
    $('.message-block').addClass('message-success');
    $("span[id='result_message']")[0].innerHTML = result_message;
    $('#addWod_button')[0].disabled = false;
  })
}

var manualEdit = function() {
  var manual_edit_checkbox = $("input[id='manual_edit_checkbox']")[0];
  var wod_content = $("textarea[id='wod_content']")[0];
  if (manual_edit_checkbox.checked) {
    wod_content.readOnly = false;
  } else {
    wod_content.readOnly = true;
  }
}

window.onload = function() {
  commonAfterLoad();
  afterLoad();
}
