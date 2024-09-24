const http = require('http');
const fs = require('fs');
const express = require('express');
const { instrument } = require("@socket.io/admin-ui");
const RoomData = require("./RoomData.js")

require('q5');
require('p5play');

const app = express();
const server = app.listen(3000);

const io = require('socket.io')(server);

instrument(io, {
    auth: {
        type: "basic",
        username: "jan",
        password: "$2a$10$F9hWr6Nq59aofYUBWhVU.uiUJTIuopzCE4bSby.gR./U5lUTB.UAm"
      },
    mode: "development",
});

app.set('port', '3000');

app.use(express.static('public'));
console.log('server started/starting');

const ROOMSTATES = {waitingForOthers:0, inGame:1}

let rooms = [];
// let players = [];  --> const sockets = await io.in(room).fetchSockets();
let roomsStates = {}; //key: roomName, value: gameState (e.g. running, waitingForPlayers, empty?, dead?, win?, etc) !mostly unused btw!
let p5Lobbies = {}; //dictionary of sorts, key being lobbyName, value being the whole p5-sketch


/**  @type {Map, RoomData}  */
let roomsDatas = new Map();

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
        delete p5Lobbies.room;
        console.log("er is gestopt")
    });
    
    // socket.on("disconnecting", async () => {
    //     for (const room of socket.rooms) {
    //         if(room != socket.id){
    //             const sockets = io.sockets.adapter.rooms.get(room);
    //             //the room the socket is in
    //             console.log(sockets + "  " + sockets.size)
    //             if(sockets.size < 2){ 
    //                 delete p5Lobbies.room;
    //                 console.log("deleted a room cause of too few players")
    //             }
    //         }
    //     }
    // })

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
                }else if(socket.data.playerNum == 2){
                    roomsDatas.get(room).p2.pressedKeys = pressedKeys;
                }
            }
        }
    });
});


// FIX DAT ER TWEEMAAL IN DEZELFDE ROOM/LOBBY EEN GAME KAN WORDEN GESTART!!! gamestates checken ofzo?

function startGame(room){
    p5Lobbies[room] = new Q5('namespace');
    p5Lobbies[room].frameRate(30)
    //verstuur hierboven de levels ofzo? doe dan onderaan de al verzonden sprite-posities updaten?!
    let level = {
        sprites : []
    }

    /** @type {Sprite} */
    let abc = new p5Lobbies[room].Sprite(20, 20, 20, 20);
    abc.text = "p1";
    let abc1 = new p5Lobbies[room].Sprite(120, 20, 20, 20);
    abc1.text = "p2"

    level.sprites.push({x: abc.x, y: abc.y, w: abc.w, h: abc.h, col: abc.color, text: abc.text})
    level.sprites.push({x: abc1.x, y: abc1.y, w: abc1.w, h: abc1.h, col: abc1.color, text: abc1.text})

    
    p5Lobbies[room].setup = () => 
    {
        new p5Lobbies[room].Canvas(1280, 720);
        // p5Lobbies[room].noCanvas();
        p5Lobbies[room].allSprites.autoDraw = false;
        //onUpdatePos en dan de shit

        io.to(room).emit("loadLevel", level);
    };

    p5Lobbies[room].draw = () => 
    {
        // background(100);
        // console.log(roomsDatas)
        // console.log(roomsDatas.get(room).p1.pressedKeys)
        
        if(roomsDatas.get(room).p1.pressedKeys.includes("w")) abc.y -= 10;
        if(roomsDatas.get(room).p1.pressedKeys.includes("a")) abc.x -= 10;
        if(roomsDatas.get(room).p1.pressedKeys.includes("s")) abc.y += 10;
        if(roomsDatas.get(room).p1.pressedKeys.includes("d")) abc.x += 10;
        
        if(roomsDatas.get(room).p2.pressedKeys.includes("w")) abc1.y -= 10;
        if(roomsDatas.get(room).p2.pressedKeys.includes("a")) abc1.x -= 10;
        if(roomsDatas.get(room).p2.pressedKeys.includes("s")) abc1.y += 10;
        if(roomsDatas.get(room).p2.pressedKeys.includes("d")) abc1.x += 10;

        
        const data = {
            sprites : [
                {x: abc.x, y: abc.y},
                {x: abc1.x, y: abc1.y}
                
            ]
        }
        try{
            io.to(room).emit("gameData", data);
        } catch(err){
            console.log(err.message)
        }
        
    };
}