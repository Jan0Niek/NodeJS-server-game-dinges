const http = require('http');
const fs = require('fs');
const express = require('express');
const { randomUUID } = require('crypto');

const app = express();
const server = app.listen(3000);

const io = require('socket.io')(server);

app.set('port', '3000');

app.use(express.static('./public'));
console.log('server started/starting');


let rooms = [];
let players = [];

io.sockets.on('connection', (socket) => {
    
    socket.on("username", (username) => { socket.data.username = username; });

    socket.on("getLobbies", () => {
        rooms.forEach(async room => {
            const sockets = await io.in(room).fetchSockets();
            let players = {};
            const theirid = socket.id;
            for (const socket of sockets){
                if(socket.id != theirid){
                    players[socket.id] = socket.data.username;
                }
            }
            socket.emit("room", room, players);
        });
    });

    socket.on("newRoom", (roomName) => {
        rooms.push(roomName);
        socket.join(roomName);
        console.log(rooms);
    });
    socket.on("joinRoom", async (roomName) => {
        socket.join(roomName); //why doesn't it work!!!!!
        console.log(rooms);
        const sockets = await io.in(roomName).fetchSockets();
        for (const socket of sockets){
            console.log(socket.data.username);
        }
    });
    
    

    
    socket.on("disconnect", (reason) => { //rooms!!!!
        socket.broadcast.emit("disconnected", socket.id, socket.data.username);
    });
   });