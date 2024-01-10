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
    
    socket.on("username", (username) => {
        socket.data.uuid = randomUUID();
        socket.data.username = username;
        socket.emit("uuid", socket.data.uuid);

        rooms.forEach(async room => {
            const sockets = await io.in(room).fetchSockets();
            let players = {};
            const theiruuid = socket.data.uuid;
            for (const socket of sockets){
                if(socket.data.uuid != theiruuid){
                    players[socket.data.uuid] = socket.data.username;
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
    
    // socket.on("join", async (username) => {
    //     //gives a player their uuid and updates others of the new join
    //     socket.data.uuid = randomUUID();
    //     socket.data.username = username;
    //     socket.broadcast.emit("join", socket.data.uuid, username);
    //     socket.emit("uuid", socket.data.uuid);

    //     //gets all other players in server/lobby, and send them to the new join
    //     const sockets = await io.fetchSockets();
    //     let players = {};
    //     const theiruuid = socket.data.uuid;
    //     for (const socket of sockets){
    //         if(socket.data.uuid != theiruuid){
    //             players[socket.data.uuid] = socket.data.username;
    //         }
    //     }
    //     socket.emit("giveSockets", players);
    // });

    socket.on("position", (data) => socket.broadcast.emit("position", data)); //moet binnen de room dat doen, niet naar elke andere room ook dit sturen

    // socket.on("disconnecting", (reason) => {
    //     for (const room of socket.rooms) {
    //       if (room !== socket.id) {
    //         socket.to(room).emit("user has left", socket.id);
    //       }
    //     }
    //   });
    socket.on("disconnect", (reason) => { //rooms!!!!
        socket.broadcast.emit("disconnected", socket.data.uuid, socket.data.username);
    });
   });