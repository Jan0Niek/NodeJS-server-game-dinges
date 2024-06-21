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
let players = [];

io.sockets.on('connection', (socket) => {
    
    socket.on("username", (username) => { socket.data.username = username; });

    socket.on("getLobbies", () => {
        rooms.forEach(async room => {
            const sockets = await io.in(room).fetchSockets();
            let players = [];
            const theirid = socket.id;
            for (const socket of sockets){
                if(socket.id != theirid){
                    players.push(socket.data.username);
                }
            }
            socket.emit("room", room, players);
        });
    });

    socket.on("newRoom", (roomName) => {
        rooms.push(roomName);
        socket.join(roomName);
        console.log("New room: " + rooms);
        console.log("Username: " + socket.data.username)
    });
    socket.on("joinRoom", async (roomName) => {
        socket.join(roomName); //why doesn't it work!!!!!
        console.log("All rooms: " + rooms);
        const sockets = await io.in(roomName).fetchSockets();
        for (const _socket of sockets){
            console.log("Usernames: " + _socket.data.username);
            socket.emit("otherPlayer", _socket.id, _socket.data.username);
            _socket.emit("otherPlayer", socket.id, socket.data.username);
        }
    });
    
    socket.on("position", (data) =>{
        socket.rooms.forEach(room => {
            socket.to(room).emit("position", data)
        });
    })

    
    socket.on("disconnect", (reason) => { //rooms!!!!
        socket.broadcast.emit("disconnected", socket.id, socket.data.username);
    });
   });