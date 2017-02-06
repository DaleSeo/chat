$(function() {
  initialize();
});

function initialize() {
  var socket = io();
  $('form').submit(function(){
    socket.emit('chat message', $('#inputMessage').val());
    $('#inputMessage').val('');
    return false;
  });

  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });
}
