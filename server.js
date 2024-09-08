const http = require('http');
const fs = require('fs');
const express = require('express');

require('q5');
require('p5play');

const app = express();
const server = app.listen(3000);

const io = require('socket.io')(server);

app.set('port', '3000');

app.use(express.static('public'));
console.log('server started/starting');

const ROOMSTATES = {waitingForOthers:0, inGame:1}

let rooms = [];
// let players = [];  --> const sockets = await io.in(room).fetchSockets();
let roomsStates = {}; //key: roomName, value: gameState (e.g. running, waitingForPlayers, empty?, dead?, win?, etc)
let p5Lobbies = {}; //dictionary of sorts, key being lobbyName, value being the whole p5-sketch

io.sockets.on('connection', (socket) => {
    
    socket.on("username", (username) => { socket.data.username = username; });

    socket.on("getLobbies", () => {
        rooms.forEach(async room => {
            const sockets = await io.in(room).fetchSockets();
            let players = [];
            for (const socket of sockets){
                players.push(socket.data.username);
                // console.log(socket.data.username);
            }
            socket.emit("room", room, players);
        });
    });

    socket.on("newRoom", (roomName) => {
        if(!rooms.includes(roomName)){
            rooms.push(roomName);
            roomsStates[roomName] = ROOMSTATES.waitingForOthers;
            socket.data.playerNum = -1;
            socket.join(roomName);
        }else{
            socket.emit("roomNameError");
        }
    });

    socket.on("joinRoom", async (roomName) => {
        socket.join(roomName); 
        socket.data.playerNum = -1;
        const sockets = await io.in(roomName).fetchSockets();
        for (const _socket of sockets){
            if(_socket.id != socket.id){
                socket.emit("otherPlayer", _socket.id, _socket.data.username);
                _socket.emit("otherPlayer", socket.id, socket.data.username);
            }
        }
    });

    socket.on("requestToBePlayerX", async (playerNum) => {
        for (const room of socket.rooms) {
            if(room != socket.id){
                const sockets = await io.in(room).fetchSockets();
                let canBeThatPlayer = true;
                for (const _socket of sockets) {
                    if(_socket.id != socket.id){
                        if(_socket.data.playerNum == playerNum){
                            canBeThatPlayer = false;
                        }
                    }
                }
                if (canBeThatPlayer){
                    socket.data.playerNum = playerNum;
                    socket.emit("playerNum", (playerNum));
                    socket.broadcast.to(room).emit("otherPlayerNum", socket.id, playerNum)
                }else{
                    //idk zeg dat hij niet playerX mag zijn??
                    socket.emit("notPlayerX");
                }
            }
        }

    });

    socket.on("readyUp", async (readiness) => {
        socket.data.ready = readiness;
        for (const room of socket.rooms) {
            if(room != socket.id){
                //the room the socket is in
                socket.to(room).emit("otherPlayerReady", socket.id, readiness);
            }
        }
    });

    socket.on("startGame", () => {
        for (const room of socket.rooms) {
            if(room != socket.id){
                p5Lobbies[room] = new Q5('namespace');
                with (p5Lobbies[room]) {
                    p5Lobbies[room].setup = () => 
                    {
                        // new Canvas(1280, 720);
                        noCanvas();
                        allSprites.autoDraw = false;
                        //onUpdatePos en dan de shit
                    };
                    p5Lobbies[room].draw = () => 
                    {
                        background(100);
                    };
                }
            }
        }
    });

    
    socket.on("position", (data) =>{
        socket.rooms.forEach(room => {
            socket.to(room).emit("position", data)
        });
    })


    io.of("/").adapter.on("delete-room", (room) => {
        const index = rooms.indexOf(room);
        if(index != -1) rooms.splice(index, 1);
    });
    
    socket.on("disconnect", (reason) => { //rooms!!!!
        // console.log(socket.data.username + " has left.")
        socket.broadcast.emit("otherPlayerDisconnect", (socket.id));
    });
   });