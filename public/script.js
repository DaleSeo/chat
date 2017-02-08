$(function() {
  initialize();
});

function initialize() {
  setSocketIo();
  addKeyEvent();
  addSubmitEvent();
}

let socket;
let username;

function setSocketIo() {
  socket = io();

  socket.on('login', function (data) {
    appendLog(`Welcome, ${data.username}! (${data.numUsers})`);
  });

  socket.on('user joined', function (data) {
    appendLog(`${data.username} joined. (${data.numUsers})`);
  });

  socket.on('chat message', function(data){
    addYourMessage(data.username, data.message);
  });
}

function addKeyEvent() {
  const $input = $('#inputUsername');
  $(window).keydown(event => {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $input.focus();
    }
  });
}

function addSubmitEvent() {
  $('#formChat').submit(() => {
    chat();
    return false;
  });

  $('#formLogin').submit(() => {
    login();
    return false;
  });
}

function login() {
  const $input = $('#inputUsername');
  const username = $input.val().trim();

  if (username) {
    $('#loginPage').fadeOut();
    $('#chatPage').show();
    $('#loginPage').off('click');

    socket.emit('add user', username);
  }
}

function chat() {
  addMyMessage($('#inputUsername').val(), $('#inputMessage').val());
  socket.emit('chat message', $('#inputMessage').val());
  $('#inputMessage').val('');
}

function appendLog(msg) {
  let $messages = $('#messages');
  $messages.append($('<li class="log">').text(msg));
  $messages[0].scrollTop = $messages[0].scrollHeight;
}

function addMyMessage(user, msg) {
  let $messages = $('#messages');
  $messages.append($('<li>').html(`<span class="label label-success">${user}</span> ${msg}`));
  $messages[0].scrollTop = $messages[0].scrollHeight;
}

function addYourMessage(user, msg) {
  let $messages = $('#messages');
  $messages.append($('<li>').html(`<span class="label label-default">${user}</span> ${msg}`));
  $messages[0].scrollTop = $messages[0].scrollHeight;
}
