const http = require('http');
const fs = require('fs');
const express = require('express');

const app = express();
const server = app.listen(3000);

const io = require('socket.io')(server);

app.set('port', '3000');

app.use(express.static('public'));
console.log('server started/starting');

let rooms = [];

io.sockets.on('connection', (socket) => {
    console.log('Client connected: ' + socket.id);

    socket.on("username", (username) => {
        socket.data.username = username;
        socket.broadcast.emit("username", socket.id, username);
    });

    socket.on("position", (data) => socket.broadcast.emit("position", data, socket.data.username));

    socket.on('disconnect', () => console.log('Client has disconnected'));
   });