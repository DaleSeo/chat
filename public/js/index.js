import Messenger from './messenger';


const TYPING_TIMER_LENGTH = 400; // ms

let messenger;
let socket;
let typing = false;

$(function() {
  messenger = new Messenger($('#messages'));
  addEventListeners();
  setSocketIo();
});

function setSocketIo() {
  socket = io();

  socket.on('login', function (data) {
    messenger.appendLog(`Welcome, ${data.username}! (${data.numUsers})`);
  });

  socket.on('user joined', function (data) {
    messenger.appendLog(`${data.username} joined. (${data.numUsers})`);
  });

  socket.on('user left', function (data) {
    messenger.appendLog(`${data.username} left. (${data.numUsers})`);
  });

  socket.on('chat message', function(data){
    messenger.appendYourMessage(data.username, data.message);
  });

  socket.on('typing', function(data) {
    messenger.appendTyping(data.username);
  });

  socket.on('stop typing', function(data) {
    messenger.removeTyping(data.username);
  });

  socket.on('disconnect', function () {
    messenger.appendLog('You have been disconnected.');
  });

  socket.on('reconnect', function () {
    messenger.appendLog('You have been reconnected.');
    login();
  });
}

function addEventListeners() {
  const $input = $('#inputMessage');
  $input.on('input', function() {
    monitorTyping();
  });

  $('#formChat').submit(() => {
    chat();
    return false;
  });

  $('#formLogin').submit(() => {
    login();
    return false;
  });
}

function monitorTyping () {
  if (!typing) {
    typing = true;
    socket.emit('typing');
  }

  let lastTypingTime = new Date().getTime();

  setTimeout(function () {
    let typingTimer = new Date().getTime();
    let timeDiff = typingTimer - lastTypingTime;
    if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
      socket.emit('stop typing');
      typing = false;
    }
  }, TYPING_TIMER_LENGTH);
}

function chat() {
  messenger.appendMyMessage($('#inputUsername').val(), $('#inputMessage').val());
  socket.emit('chat message', $('#inputMessage').val());
  $('#inputMessage').val('');
}

function login() {
  const $input = $('#inputUsername');
  const username = $input.val().trim();

  if (username) {
    $('#loginPage').fadeOut();
    $('#loginPage').off('click');
    $('#chatPage').show();
    $('#inputMessage').focus();

    socket.emit('add user', username);
  }
}
