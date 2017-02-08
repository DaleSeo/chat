var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 5000));

// static
app.use(express.static(__dirname + '/public'));

// dynamic
app.get('/test', function(req, res){
  res.send('Test!');
});

let numUsers = 0;

// socket
io.on('connection', function(socket) {
	console.log('a user connected');

  socket.on('add user', (username) => {
    console.log(username, ' has logged in');

    socket.username = username;
    ++numUsers;

    let data = {
      username: username,
      numUsers: numUsers
    };

    socket.emit('login', data);

    socket.broadcast.emit('user joined', data);
  });

  socket.on('chat message', function(msg) {
		console.log('message: ' + msg);
		socket.broadcast.emit('chat message', {
      username: socket.username,
      message: msg
    });
	});

	socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
