const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.broadcast.emit('connected', socket.id);

  socket.on('disconnect', () => {
    io.emit('disconnected', socket.id);
  });

  socket.on('chat message', (msg, id) => {
    console.log(`Message from ${id}: "${msg}"`);
    socket.broadcast.emit('chat message', msg, id);
  });

  socket.on('typing', (id) => {
    socket.broadcast.emit('typing', id);
  });

  socket.on('not-typing', () => {
    socket.broadcast.emit('not-typing');
  });
});

server.listen(4000, () => {
  console.log('listening on port *:4000');
})