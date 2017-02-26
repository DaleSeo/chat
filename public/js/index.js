import $ from 'jquery';
import Util from './util';
import Messenger from './messenger';

const TYPING_TIMER_LENGTH = 400; // ms

let messenger;
let socket;
let typing = false;

function sendMessage() {
  messenger.appendMessage($('#inputUsername').val(), $('#inputMessage').val());
  socket.emit('send message', $('#inputMessage').val(), (data) => {
    messenger.appendLog(data);
  });
  $('#inputMessage').val('');
}

function login() {
  const $input = $('#inputUsername');
  const username = $input.val().trim();
  messenger.setUsername(username);

  if (username) {
    socket.emit('add user', username, (okay) => {
      if (okay) {
        $('#loginPage').fadeOut();
        $('#loginPage').off('click');
        $('#chatPage').show();
        $('#inputMessage').focus();
        loadPastMessages();
      } else {
        $('#errorUsername').text('That username is already taken!');
      }
    });
  }
}

function loadPastMessages() {
  $.getJSON('/loadPastMessages')
    .done(messages => {
      messages.forEach(msg => {
        messenger.appendMessage(msg.username, msg.message);
      });
    });
}

$(function() {
  messenger = new Messenger($('#messages'));

  addEventListenersToDocument();
  addEventListenersToSocket();
});

function addEventListenersToSocket() {
  socket = require('socket.io-client')();

  socket.on('login', (data) => {
    messenger.appendLog(`Welcome, ${data.username}! (${data.numUsers})`);
  });

  socket.on('user joined', (data) => {
    messenger.appendLog(`${data.username} joined. (${data.numUsers})`);
  });

  socket.on('user left', (data) => {
    messenger.appendLog(`${data.username} left. (${data.numUsers})`);
  });

  socket.on('users', (users) => {
    let html = '';
    for (let user of users) {
      html += `<li>${user}</li>`;
    }
    $('#users').html(html);
  });

  socket.on('new message', (data) => {
    messenger.appendMessage(data.username, data.message);
  });

  socket.on('direct message', (data) => {
    messenger.appendDirectMessage(data.username, data.message);
  });

  socket.on('typing', (data) => {
    messenger.appendTyping(data.username);
  });

  socket.on('stop typing', (data) => {
    messenger.removeTyping(data.username);
  });

  socket.on('disconnect', () => {
    messenger.appendLog('You have been disconnected.');
  });

  socket.on('reconnect', () => {
    messenger.appendLog('You have been reconnected.');
    login();
  });
}

function addEventListenersToDocument() {
  const $input = $('#inputMessage');
  $input.on('input', (e) => {
    monitorTyping();
  });

  $('#formChat').submit((e) => {
    e.preventDefault();
    sendMessage();
  });

  $('#formLogin').submit((e) => {
    e.preventDefault();
    login();
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
