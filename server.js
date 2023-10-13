const http = require('http');
const fs = require('fs');
const express = require('express');
const { randomUUID } = require('crypto');

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
        socket.data.uuid = randomUUID();
        socket.data.username = username;
        socket.broadcast.emit("join", socket.data.uuid, username);
        socket.emit("uuid", socket.data.uuid);
    });

    socket.on("giveSockets", async () => {
        const sockets = await io.fetchSockets();
        let players = {};
        const theiruuid = socket.data.uuid;
        for (const socket of sockets){
            if(socket.data.uuid != theiruuid){
                players[socket.data.uuid] = socket.data.username;
            }
        }
        socket.emit("giveSockets", players);
    })

    socket.on("position", (data) => socket.broadcast.emit("position", data, socket.data.username));

    // socket.on("disconnecting", (reason) => {
    //     for (const room of socket.rooms) {
    //       if (room !== socket.id) {
    //         socket.to(room).emit("user has left", socket.id);
    //       }
    //     }
    //   });
    socket.on("disconnect", (reason) => {
        console.log("client disconnected: " + socket.id + " " + socket.data.username);
        socket.broadcast.emit("disconnected", socket.data.uuid, socket.data.username);
    });
   });