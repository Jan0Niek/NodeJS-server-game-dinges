//dependencies and or such
const Q5 = require('./node_modules/q5/q5-server.js');
const http = require('http');
const fs = require('fs');
const express = require('express');
const { instrument } = require("@socket.io/admin-ui");
const RoomData = require("./RoomData.js");
const {declareSelectables} = require("./game/selectables.js")
const {declarePlayer} = require("./game/player.js")
const LEVELS = require("./game/levels.json")


require('q5');
require('p5play');


const TILESIZE = {x:40, y:40, w:40, h:40};

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

const ROOMSTATES = {unset:-1, waitingForSecondPlayer:1, notBothReadiedUp:2, oneOfTwoReadiedUp:7, everybodyReadiedUp:3, gameStarting:8, gameRunning:4, gamePaused:20, onePlayerLeft:5, bothPlayersLeft:6}

// let rooms = []; // probably shouldn't use this anymore

// let players = [];  --> const sockets = await io.in(room).fetchSockets();
// let roomsStates = {}; //key: roomName, value: gameState (e.g. running, waitingForPlayers, empty?, dead?, win?, etc) !mostly unused btw!
// let p5Lobbies = {}; //dictionary of sorts, key being lobbyName, value being the whole p5-sketch

//key is roomName , value is everything in the room by using an instance of the RoomData class
/** @type {Map<string, RoomData>} */
let roomsDatas = new Map();


io.sockets.on('connection', (socket) => {
    
    socket.on("username", (username) => { socket.data.username = username; });
    socket.on("testtest", () => { 
        roomsDatas.forEach(roomData => {
            console.log(roomData.p5Lobby)
        });
    });

    socket.on("getLobbies", async () => {
        for (const room of roomsDatas.keys()) {
            const sockets = await io.in(room).fetchSockets();
            let players = [];
            for (const socket of sockets){
                players.push(socket.data.username);
                // console.log(socket.data.username);
            }
            socket.emit("room", room, players);
        }
    });

    socket.on("newRoom", (roomName) => {
        if(!roomsDatas.has(roomName)){
            roomsDatas.set(roomName, new RoomData())
            roomsDatas.get(roomName).roomState = ROOMSTATES.waitingForSecondPlayer //may change this bs
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
            }if(_socket.data.playerNum == 2){
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
        console.log(`room ${room} removed?`)
        if(roomsDatas.has(room)){
            if(roomsDatas.get(room).p5Lobby != null){
                roomsDatas.get(room).p5Lobby.allSprites.removeAll();
                roomsDatas.get(room).p5Lobby = null;
            }
        }
        roomsDatas.delete(room)
        console.log("for real removed")

    });
    
    socket.on("disconnecting", async () => {
        
    })

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


// FIX DAT ER TWEEMAAL IN DEZELFDE ROOM/LOBBY EEN GAME KAN WORDEN GESTART!!! gamestates checken ofzo? is dit al gefixt of niet?

function startGame(room){
    roomsDatas.get(room).p5Lobby = new Q5("instance");
    let p5 = roomsDatas.get(room).p5Lobby;

    declareSelectables(TILESIZE, p5)
    declarePlayer(TILESIZE, p5)

    p5.frameRate(30)
    p5.noCanvas();
    p5.allSprites.autoDraw = false;
    p5.world.gravity.y = 9.81;
    p5.allSprites.drag = 0.24;
    p5.world.allowSleeping = false;
    // p5.allSprites.autoUpdate = true;
    // p5.allSprites.autoUpdate = true;

    roomsDatas.get(room).setLevel(0, LEVELS)

    new p5.Tiles(roomsDatas.get(room).currentLevel.levelTilesRows, 0, 0, TILESIZE.x, TILESIZE.y)
    // p5.world.gravity.y = 10
    //verstuur hierboven de levels ofzo? doe dan onderaan de al verzonden sprite-posities updaten?!

    // let playerOne;
    // p5.allSprites.forEach(sprite => {if(sprite.tile=='p') playerOne=sprite;})

    
    p5.setup = () => 
    {
        // new p5.Canvas(1280, 720);
        p5.noCanvas();
        p5.allSprites.autoDraw = false;
        //onUpdatePos en dan de shit

        new p5.Sprite (0, 720, 10000, 40, 'k')
        let currentRoom = roomsDatas.get(room)
        p5.allSprites.forEach(sprite => {
            if(sprite.setup != null) sprite.setup(currentRoom.p1)
        })

        let levelDataToSend = [];
        p5.allSprites.forEach(sprite =>{
            levelDataToSend.push({id: sprite.idNum, x: sprite.x, y: sprite.y, w: sprite.w, h: sprite.h, col: sprite.color, text: sprite.text, imageName: sprite.imageName})
        })

        io.to(room).emit("loadLevel", levelDataToSend);
    };

    p5.draw = () => 
    {
        // background(100);
        // console.log(roomsDatas)
        // console.log(roomsDatas.get(room).p1.pressedKeys)
        
        // if(roomsDatas.get(room).p1.pressedKeys.includes("w")) playerOne.y -= 10;
        // if(roomsDatas.get(room).p1.pressedKeys.includes("a")) playerOne.x -= 10;
        // if(roomsDatas.get(room).p1.pressedKeys.includes("s")) playerOne.y += 10;
        // if(roomsDatas.get(room).p1.pressedKeys.includes("d")) playerOne.x += 10;
                
        //zorg dat dit niet handmatig ingevuld hoeft te worden, gebruik p5.allSprites
        const data = [];
        p5.allSprites.forEach(sprite =>{
            // sprite.currentRoom = roomsDatas.get(room)
            sprite.update(roomsDatas.get(room))
            data.push({id: sprite.idNum, x: sprite.x, y: sprite.y, rot: sprite.rotation})
        })
        try{
            io.to(room).emit("gameData", data);
        } catch(err){
            console.log(err.message)
        }
        
    };
}