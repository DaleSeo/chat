const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let users = {};

app.set('port', (process.env.PORT || 5000));

// static
app.use(express.static(__dirname + '/public'));

// dynamic
app.get('/test', function(req, res){
  res.send('Test!');
});

app.get('/loadPastMessages', (req, res) => {
  let messages = [
    {username: 'Dale', message: 'Hi!'},
    {username: 'Kate', message: 'Hey~'},
    {username: 'Dale', message: 'Welcome :)'}
  ];
  res.send(messages);
});

// socket
io.on('connection', (socket) => {
	console.log('a user connected');

  socket.on('add user', (username, callback) => {
    if (username in users) {
      console.log('duplicated user!');
      callback(false);
    } else {
      console.log(username, ' has logged in');
      callback(true);
      socket.username = username;
      users[socket.username] = socket;
      io.emit('users', Object.keys(users));
      socket.emit('login', {
        username: username,
        numUsers: Object.keys(users).length
      });
      socket.broadcast.emit('user joined', {
        username: username,
        numUsers: Object.keys(users).length
      });
    }
  });

  socket.on('send message', (msg, callback) => {
		console.log(`message: ${msg} from ${socket.username}`);
    msg = msg.trim();
    if (msg.substr(0, 3) === '/w ') {
      msg = msg.substr(3);
      let idx = msg.indexOf(' ');
      if (idx > -1) {
        let username = msg.substr(0, idx);
        msg = msg.substr(idx + 1);
        if (username in users) {
          users[username].emit('direct message', {
            username: socket.username,
            message: msg
          });
          console.log('Whispering...');
        }
      } else {
        callback('Please enter a message to send a direct message.');
      }
    } else {
      socket.broadcast.emit('new message', {
        username: socket.username,
        message: msg
      });
    }
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
    if (!socket.username) return;
    delete users[socket.username];
    io.emit('users', Object.keys(users));
    socket.broadcast.emit('user left', {
      username: socket.username,
      numUsers: Object.keys(users).length
    });
  });
});

http.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
