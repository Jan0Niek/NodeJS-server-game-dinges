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
let roomsStates = {}; //key: roomName, value: gameState (e.g. running, waitingForPlayers, empty?, dead?, win?, etc) !mostly unused btw!
let p5Lobbies = {}; //dictionary of sorts, key being lobbyName, value being the whole p5-sketch

class RoomData{
    constructor(){
        this.p1 = {
            name : null, 
            pressedKeys : []
            
        }
        this.p2 = {
            name : null, 
            pressedKeys : []
            
        }
    }
}

/**  @type {Map, RoomData}  */
let roomsDatas = new Map();
    /* example: 
    room: {
        p1: {
            pressedKeys = [],
            grounded = false
            etc etc etc
        }
    }
    */

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
            roomsDatas.set(roomName, new RoomData())
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
                const data = {
                    id: _socket.id,
                    username: _socket.data.username,
                    playerNum: _socket.data.playerNum,
                    readiness: _socket.data.ready
                }
                socket.emit("otherPlayer", data);
                const _data = {
                    id: socket.id,
                    username: socket.data.username,
                    playerNum: socket.data.playerNum,
                    readiness: socket.data.ready
                }
                _socket.emit("otherPlayer", _data);
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
        let theRoom;
        for (const room of socket.rooms) {
            if(room != socket.id){
                //the room the socket is in
                socket.to(room).emit("otherPlayerReady", socket.id, readiness);
                theRoom = room;
            }
        }

        //hieronder een niet werkend ready-systeem
        const sockets = await io.in(theRoom).fetchSockets();
        let p1Ready = false;
        let p2Ready = false;
        for (const _socket of sockets) {
            if(_socket.data.playerNum == 1){
                if(_socket.data.ready) p1Ready=true; 
            }if(socket.data.playerNum == 2){
                if(_socket.data.ready) p2Ready=true; 
            }
        }
        if(p1Ready && p2Ready) {
            startGame(theRoom); 
            console.log("er is begonnen");
            io.to(theRoom).emit("startGame");
        }

    });


    io.of("/").adapter.on("delete-room", (room) => {
        const index = rooms.indexOf(room);
        if(index != -1) rooms.splice(index, 1);
    });
    
    socket.on("disconnect", (reason) => { //rooms!!!!
        // console.log(socket.data.username + " has left.")
        socket.broadcast.emit("otherPlayerDisconnect", (socket.id));
    });


    socket.on("pressedKeys", (pressedKeys) =>{
        for (const room of socket.rooms) {
            if(room != socket.id){
                //the room the socket is in
                if(socket.data.playerNum == 1){
                    roomsDatas.get(room).p1.pressedKeys = pressedKeys;
                }else if(socket.data.playerNum == 1){
                    roomsDatas.get(room).p2.pressedKeys = pressedKeys;
                }
            }
        }
    });
});

function startGame(room){
    p5Lobbies[room] = new Q5('namespace');
    with (p5Lobbies[room]) {

        let abc = new Sprite(20, 20, 20, 20);
        p5Lobbies[room].setup = () => 
        {
            // new Canvas(1280, 720);
            noCanvas();
            allSprites.autoDraw = false;
            //onUpdatePos en dan de shit

        };
        p5Lobbies[room].draw = () => 
        {
            // background(100);
            // console.log(roomsDatas)
            // console.log(roomsDatas.get(room).p1.pressedKeys)
            
            if(roomsDatas.get(room).p1.pressedKeys.includes("a")) abc.x++;

            
            const data = {
                sprit1: abc
            }
            io.to(room).emit("gameData", data);
        };
    }
}