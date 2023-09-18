const http = require('http');
const fs = require('fs');
const express = require('express');

const app = express();
const server = app.listen(3000);

const io = require('socket.io')(server);

app.set('port', '3000');

app.use(express.static('public'));
console.log('server started/starting');

io.sockets.on('connection', (socket) => {
    console.log('Client connected: ' + socket.id);
    socket.on('mouse', (data) => socket.broadcast.emit('mouse', data));
    socket.on('disconnect', () => console.log('Client has disconnected'));
   });