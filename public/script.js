$(function() {
  initialize();
});

function initialize() {
  addKeyEvent();
  setSocketIo();
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
      alert($input.val());
    }
  });
}

function setSocketIo() {
  var socket = io();
  $('form').submit(function(){
    socket.emit('chat message', $('#inputMessage').val());
    $('#inputMessage').val('');
    return false;
  });

  socket.on('chat message', function(msg){
    addMessage('Joe', msg);
  });
}

function addMessage(user, msg) {
  let $messages = $('#messages');
  $messages.append($('<li>').text(`${user}: ${msg}`));
  $messages[0].scrollTop = $messages[0].scrollHeight;
}
