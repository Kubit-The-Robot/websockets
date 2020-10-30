const express = require('express');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/server', (req, res) => {
  res.send('kubit is watching you...');
});

io.on('connection', (client) => {
  console.log('a user connected');

  client.on('chat', (data) => {
    console.log('Message received -->', data);

    io.emit('chat', data);
  })
});

// Now make our new WS server listen to port 5000
io.listen(5000, () => {
  console.log('Listening ... 🚀 ');
});