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
        if(!rooms.includes(roomName)){
            rooms.push(roomName);
            roomsStates[roomName] = ROOMSTATES.waitingForOthers;
            socket.join(roomName);
        }else{
            socket.emit("roomNameError");
        }
    });

    socket.on("joinRoom", async (roomName) => {
        socket.join(roomName); //why doesn't it work!!!!!
        console.log("All rooms: " + rooms);
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
                console.log("room: " + room)
                const sockets = await io.in(room).fetchSockets();
                let canBeThatPlayer = true;
                for (const _socket of sockets) {
                    if(_socket.id != socket.id){
                        console.log("andere user: " + _socket.data.username);
                        if(_socket.data.playerNum == playerNum){
                            canBeThatPlayer = false;
                            console.log(socket.data.username + ' mag niet!!!');
                        }
                    }
                }
                if (canBeThatPlayer){
                    socket.data.playerNum = playerNum;
                    console.log(socket.data.username +' hij mag!')
                    socket.emit("playerNum", (playerNum));
                    socket.broadcast.to(room).emit("otherPlayerNum", (socket.id, playerNum))
                }else{
                    //idk zeg dat hij niet playerX mag zijn??
                    socket.emit("notPlayerX");
                }
            }
        }

    });

    socket.on("startGame", () => {

        p5Lobbies[socket.rooms[0]] = new Q5('namespace');
        with (p5Lobbies[socket.rooms[0]]) {
            p5Lobbies[socket.rooms[0]].setup = () => 
            {
                // new Canvas(1280, 720);
                noCanvas();
                allSprites.autoDraw = false;
                //onUpdatePos en dan de shit
            };
            p5Lobbies[socket.rooms[0]].draw = () => 
            {
                background(100);
                console.log('ja')
            };
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