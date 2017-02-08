$(function() {
  initialize();
});

function initialize() {
  setSocketIo();
  addKeyEvent();
}

let socket;

function setSocketIo() {
  socket = io();
  $('form').submit(function(){
    socket.emit('chat message', $('#inputMessage').val());
    $('#inputMessage').val('');
    return false;
  });

  socket.on('login', function (data) {
    appendLog("Welcome to Chat App!");
    appendParticipantsLog(data);
  });

  socket.on('user joined', function (data) {
    appendLog(data.username + ' joined');
    appendParticipantsLog(data);
  });

  socket.on('chat message', function(msg){
    addMessage('Joe', msg);
  });
}

function addKeyEvent() {
  const $input = $('#inputUsername');
  $(window).keydown(event => {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $input.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      setUsername();
    }
  });
}

function setUsername() {
  const $input = $('#inputUsername');
  const username = $input.val().trim();

  if (username) {
    $('#loginPage').fadeOut();
    $('#chatPage').show();
    $('#loginPage').off('click');

    socket.emit('add user', username);
  }
}

function appendParticipantsLog(data) {
  var message = '';
  if (data.numUsers === 1) {
    message += "there's 1 participant";
  } else {
    message += "there are " + data.numUsers + " participants";
  }
  appendLog(message);
}

function appendLog(msg) {
  let $messages = $('#messages');
  $messages.append($('<li class="log">').text(msg));
  $messages[0].scrollTop = $messages[0].scrollHeight;
}

function addMessage(user, msg) {
  let $messages = $('#messages');
  $messages.append($('<li>').text(`${user}: ${msg}`));
  $messages[0].scrollTop = $messages[0].scrollHeight;
}
