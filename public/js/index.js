const TYPING_TIMER_LENGTH = 400; // ms

let socket;
let username;
let typing = false;

$(function() {
  initialize();
});

function initialize() {
  const $input = $('#inputMessage');
  $input.on('input', function() {
    monitorTyping();
  });

  setSocketIo();
  addKeyEvent();
  addSubmitEvent();
}

function monitorTyping () {
  if (!typing) {
    typing = true;
    socket.emit('typing');
  }

  let lastTypingTime = new Date().getTime();

  setTimeout(function () {
    var typingTimer = new Date().getTime();
    var timeDiff = typingTimer - lastTypingTime;
    if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
      socket.emit('stop typing');
      typing = false;
    }
  }, TYPING_TIMER_LENGTH);
}

function setSocketIo() {
  socket = io();

  socket.on('login', function (data) {
    appendLog(`Welcome, ${data.username}! (${data.numUsers})`);
  });

  socket.on('user joined', function (data) {
    appendLog(`${data.username} joined. (${data.numUsers})`);
  });

  socket.on('user left', function (data) {
    appendLog(`${data.username} left. (${data.numUsers})`);
  });

  socket.on('chat message', function(data){
    addYourMessage(data.username, data.message);
  });

  socket.on('typing', function(data) {
    showTyping(data.username);
  });

  socket.on('stop typing', function(data) {
    hideTyping(data.username);
  });

  socket.on('disconnect', function () {
    appendLog('You have been disconnected.');
  });

  socket.on('reconnect', function () {
    appendLog('You have been reconnected.');
    login();
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

function showTyping(user) {
  let $messages = $('#messages');
  $messages.append($('<li class="log">').html(`${user} is typing...`).data('user', user));
  $messages[0].scrollTop = $messages[0].scrollHeight;
}

function hideTyping(user) {
  getTypingMessages(user).fadeOut(function () {
    $(this).remove();
  });
}

function getTypingMessages(user) {
  return $('.log').filter(function (i) {
    return $(this).data('user') === user;
  });
}
