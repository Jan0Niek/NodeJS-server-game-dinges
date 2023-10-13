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

    socket.on("join", (username) => {
        socket.data.username = username;
        socket.broadcast.emit("join", socket.id, username);
    });

    socket.on("position", (data) => socket.broadcast.emit("position", data, socket.data.username));

    // socket.on("disconnecting", (reason) => {
    //     for (const room of socket.rooms) {
    //       if (room !== socket.id) {
    //         socket.to(room).emit("user has left", socket.id);
    //       }
    //     }
    //   });
    socket.on("disconnect", (reason) => {
        socket.broadcast.emit("disconnected", socket.id, socket.data.username);
    });
   });