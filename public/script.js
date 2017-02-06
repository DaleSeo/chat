$(function() {
  initialize();
});

function initialize() {
  var $messages = $('#messages'); // Messages area

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
