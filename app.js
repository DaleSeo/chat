const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let users = new Set();

app.set('port', (process.env.PORT || 5000));

// static
app.use(express.static(__dirname + '/public'));

// dynamic
app.get('/test', function(req, res){
  res.send('Test!');
});

// socket
io.on('connection', (socket) => {
	console.log('a user connected');

  socket.on('add user', (username, callback) => {
    if (users.has(username)) {
      console.log('duplicated user!');
      callback(false);
    } else {
      console.log(username, ' has logged in');
      callback(true);
      socket.username = username;
      users.add(username);
      io.emit('users', Array.from(users));
      socket.emit('login', {
        username: username,
        numUsers: users.size
      });
      socket.broadcast.emit('user joined', {
        username: username,
        numUsers: users.size
      });
    }
  });

  socket.on('send message', (msg) => {
		console.log(`message: ${msg} from ${socket.username}`);
		socket.broadcast.emit('new message', {
      username: socket.username,
      message: msg
    });
	});

  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

	socket.on('disconnect', () => {
    console.log('user disconnected');
    if (!socket.nickname) return;
    users.delete(socket.username);
    io.emit('users', Array.from(users));
    socket.broadcast.emit('user left', {
      username: socket.username,
      numUsers: users.size
    });
  });
});

http.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
