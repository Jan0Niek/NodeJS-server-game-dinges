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
    socket.on("mousePressed", (x, y) =>{
        for (const room of socket.rooms) {
            if(room != socket.id){
                //the room the socket is in
                if(socket.data.playerNum == 2){
                    roomsDatas.get(room).mouseClickP2() //call een functie die in room door alle p5.selectables loopt en checkt of muis erin zit
                }
            }
        }
    });
});


// FIX DAT ER TWEEMAAL IN DEZELFDE ROOM/LOBBY EEN GAME KAN WORDEN GESTART!!! gamestates checken ofzo? is dit al gefixt of niet?

function startGame(room){
    roomsDatas.get(room).p5Lobby = new Q5("instance");
    let p5 = roomsDatas.get(room).p5Lobby;

    // declarep5.Selectables(TILESIZE, p5)
    // declarePlayer(TILESIZE, p5)
    
    let playerGroup = new p5.Group(); //om de een of andere reden werkt dit (tile) alleen als group, niet als sprite... bruh
    playerGroup.tile = 'p';
    playerGroup.w = TILESIZE.x
    playerGroup.h = TILESIZE.y*2
    playerGroup.rotationLock = true;
    playerGroup.friction = 0;
    playerGroup.gravityScale = 1.5

    playerGroup.constantGravityScale = 1.5
    playerGroup.jumpStrength = 9;
    playerGroup.movementspeed = 4;
    playerGroup.movingspeed = 0;
    playerGroup.grounded = false;
    playerGroup.jumpingAble = false
    playerGroup.coyoteTime = 100; //miliseconds
    playerGroup.leftAllowed = true;
    playerGroup.rightAllowed = true;
    playerGroup.pressedKeys = [];


    playerGroup.addGlueJoints = function(){
        this.leftGlue  = new p5.GlueJoint(this, this.leftSensor)
        this.rightGlue = new p5.GlueJoint(this, this.rightSensor)

        this.rightGlue.visible = false;
        this.leftGlue.visible = false;
    }
    playerGroup.addLeftRightSensors = function(){
        this.leftSensor = new p5.Sprite(this.x-this.w*0.5, this.y-(this.halfHeight*0.5 - 6), 1, this.halfHeight+6, 'n')
        this.rightSensor = new p5.Sprite(this.x+this.w*0.5, this.y-(this.halfHeight*0.5 - 6), 1, this.halfHeight+6, 'n')

        this.leftSensor.visible = false;
        this.rightSensor.visible = false;
    }

    playerGroup.setup = function(){
        // console.log("aaaaAA!!" + typeof currentRoom.pressedKeys)
        this.addLeftRightSensors()
        this.addGlueJoints()


        this.groundSensor = new p5.Sprite(this.x, this.y+this.halfHeight, this.w*0.8, this.movementspeed)
        this.groundSensorGlue = new p5.GlueJoint(this, this.groundSensor)
        // this.groundSensor.visible=false;
        this.groundSensorGlue.visible=false;

        this.groundSensor.overlapping(p5.allSprites, (sensor, sprite2)=>{
            if(sprite2.vel.x == 0 && (!this.leftSensor.overlapping(p5.allSprites) || this.rightSensor.overlapping(p5.allSprites))) this.vel.x = 0 
                    //dit is shitcode puur omdat ik niet de al ingebouwde physics van p5play met friction gebruik, mAAR:
                    // in dat geval had ik weer andere shitcode om te voorkomen dat hij ook verticaal met platformpjes zou wrijven en dan wallslides doen;
                    //beide opties zijn matig volgens mij, deze vast het matigst. het werkt, dus..? 
        })

    }

    playerGroup.update = function(){
        // this.pressedKeys = theKeys;
        // console.log(`p1 keys: ${roomsDatas.get(room).p1.pressedKeys}`)
        // this.gravityScale = this.constantGravityScale;
        //should be something different than just pressedkeys.includes(), since it's a thing you shouldn't hold, but re-press
        if((roomsDatas.get(room).p1.pressedKeys.includes(' ') || roomsDatas.get(room).p1.pressedKeys.includes('w')) && this.grounded){
            //let's just say that the double jump bug is actually a feature for the pro gamers
            this.vel.y = -this.jumpStrength;
            // this.applyForceScaled(0, -this.jumpStrength*100)
            this.grounded = false;
        }
        if(roomsDatas.get(room).p1.pressedKeys.includes(' ') || roomsDatas.get(room).p1.pressedKeys.includes('w')) this.applyForceScaled(0, -this.jumpStrength*0.6)
        // if(this.pressedKeys.includes('s')) this.applyForceScaled(0, this.jumpStrength)


        if(this.groundSensor.overlapping(p5.allSprites)){
            this.grounded = true;
        }       
        if(this.groundSensor.overlapped(p5.allSprites)){
            setTimeout(()=>{
                if(!this.groundSensor.overlapping(p5.allSprites)) this.grounded = false;
            }, this.coyoteTime)
        }
        
        this.leftAllowed = true
        this.rightAllowed = true
        if(this.leftSensor.overlapping(p5.allSprites)){
            this.leftAllowed = false
            this.x+=0.04;
        }
        if(this.rightSensor.overlapping(p5.allSprites)){
            this.rightAllowed = false
            this.x-=0.04;
        }
        

        
        // comment hieronderaan is ongeldig aangezien ik überhaupt al geen velocity's gebruik volgens mij dan ofzo
        if(roomsDatas.get(room).p1.pressedKeys.includes('a') && this.leftAllowed){
            this.x += -this.movementspeed
        }
        if(roomsDatas.get(room).p1.pressedKeys.includes('d') && this.rightAllowed){
            this.x +=  this.movementspeed
        }

        // this.vel.x *= 0.98
        //ik zou movement moeten lerp'en ofzoiets om het soepeler te maken dan een accel van ∞
    }
    
    p5.selectables = new p5.Group()
    // p5.selectables.collider = 'k'
    p5.selectables.selected = false
    p5.selectables.w = TILESIZE.x
    p5.selectables.color = p5.color(100, 200, 100)

    p5.selectables.friction=0
    p5.selectables.pressedKeys = []

    p5.selectables.checkSelection = function(){
        // p5.selectables.pressedKeys = pressedKeys
            p5.selectables.forEach(selectable => {
                //mouse.presses moet veranderd worden!!!!!!! die kan nie!
                if (selectable.mouse.presses()) {
                    p5.selectables.forEach(selectable => {
                        // idk why just setting it to false for the whole group doesnt work or something like p5.selectables.selected = () => false but another forEach works ig
                        selectable.selected = false
                    })
                    // console.log("selectable was pressed!" + selectable.idNum);
                    
                    selectable.color = random(0, 255)
                    selectable.selected = true
                }
            })

        p5.selectables.horizontalInput = 0
        p5.selectables.verticalInput = 0
        if(roomsDatas.get(room).p2.pressedKeys.includes('d'))  p5.selectables.horizontalInput += 1
        if(roomsDatas.get(room).p2.pressedKeys.includes('a'))  p5.selectables.horizontalInput -= 1
        if(roomsDatas.get(room).p2.pressedKeys.includes('w'))  p5.selectables.verticalInput += 1
        if(roomsDatas.get(room).p2.pressedKeys.includes('s'))  p5.selectables.verticalInput -= 1
    }
    p5.selectables.update = function(){ p5.selectables.checkSelection() }



    let blocks = new p5.selectables.Group();
    blocks.collider = 'k'
    blocks.movementspeed = 3
    blocks.rotationLock = true //maybe rotating blocks someday
    blocks.tile = 'b'

    function blocksRelativity(sensor, sprite2){
        if(sensor.joints[0].spriteA.selected) sprite2.vel.x = (sensor.vel.x);
        
    }

    blocks.setup = function(){
        this.topSensor = new p5.Sprite(this.x, this.y-this.halfHeight, this.w*0.9, 4, 'n');
        this.topSensorGlue = new p5.GlueJoint(this, this.topSensor);

        this.topSensor.visible=false;
        this.topSensorGlue.visible=false;

        this.topSensor.overlapping(p5.allSprites, blocksRelativity)
    }

    blocks.stopGlideMovement = function(){
        if(p5.selectables.verticalInput !== 0)   return;
        this.y -= (this.pos.y - this.prevPos.y);

        if(p5.selectables.horizontalInput !== 0)  return;
        this.x -= (this.pos.x - this.prevPos.x);
    }
    blocks.movement = function(){
        this.velocity.set(0, 0)
        this.vel.x += p5.selectables.horizontalInput*this.movementspeed
        this.vel.y += p5.selectables.verticalInput*this.movementspeed
    }


    blocks.update = function(){
        p5.selectables.checkSelection()
        //how 'this' works in js is a mess... hate it
        if (this.selected) {
            this.collider = 'd'
            this.stopGlideMovement()
            this.movement()
        } else {
            this.vel.set(0, 0) // have seriously no clue why i have to set their velocity to nil, they should be of collider kinematic and thusly not move...
            this.collider = 'k'
        }
    }
    //maak blocks.draw function ooit!!
    
    let selectableEnemies = new p5.selectables.Group()
    selectableEnemies.w = p5.selectables.w*0.9
    selectableEnemies.h = 'triangle';
    selectableEnemies.collider = 'd'
    selectableEnemies.movementspeed = 0
    selectableEnemies.friction=0
    selectableEnemies.movingspeed = selectableEnemies.movementspeed //for reversing left-right movement
    selectableEnemies.tile = 'e'
    selectableEnemies.rotationLock = true


    selectableEnemies.collides(p5.allSprites, killCheck) //kan ook in 1x enkel collision checken met player-(group?)
    
    function killCheck(enemy, col){
        if(col.tile == 'p'){
            p5.setup()
        }
    }

    selectableEnemies.addGlueJoints = function(){
        this.leftGlue  = new p5.GlueJoint(this, this.leftSensor)
        this.rightGlue = new p5.GlueJoint(this, this.rightSensor)

        this.rightGlue.visible = false;
        this.leftGlue.visible = false;
    }
    selectableEnemies.addLeftRightSensors = function(){
        this.leftSensor = new p5.Sprite(this.x-this.w*0.5, this.y-5, 5, 10, 'n')
        this.rightSensor = new p5.Sprite(this.x+this.w*0.5, this.y-5, 5, 10, 'n')

        this.leftSensor.visible = false;
        this.rightSensor.visible = false;
        // this.leftSensor.overlaps(p5.allSprites, turnRight)
        // this.rightSensor.overlaps(p5.allSprites, turnLeft)
    }
    

    selectableEnemies.normalMovement = function(){
        this.x += this.movingspeed; //ik zou dingen met velocity's en met forces moeten doen, maar zo is makkelijker

        if(this.leftSensor.overlapping(p5.allSprites)) this.movingspeed = this.movementspeed;
        if(this.rightSensor.overlapping(p5.allSprites)) this.movingspeed = -this.movementspeed;
    }
    selectableEnemies.controlledMovement = function(){
        this.velocity.x = 0
        
        this.vel.x += p5.selectables.horizontalInput*selectableEnemies.movementspeed
    }

    selectableEnemies.setup = function(){
        this.addLeftRightSensors()
        this.addGlueJoints()
        // console.log("as")
    }

    selectableEnemies.update = function(){
        if (this.selected) {
            this.controlledMovement()
        } else {
            this.normalMovement()
        }
    }

    p5.frameRate(60)
    p5.noCanvas();
    p5.allSprites.autoDraw = false;
    p5.world.gravity.y = 9.81;
    p5.allSprites.drag = 0.24;
    p5.world.allowSleeping = false;
    // p5.allSprites.autoUpdate = false;

    roomsDatas.get(room).setLevel(0, LEVELS)

    new p5.Tiles(roomsDatas.get(room).currentLevel.levelTilesRows, 0, 0, TILESIZE.x, TILESIZE.y)
    // p5.world.gravity.y = 10
    //verstuur hierboven de levels ofzo? doe dan onderaan de al verzonden sprite-posities updaten?!

    let playerOne;
    p5.allSprites.forEach(sprite => {if(sprite.tile=='p') playerOne=sprite;})

    
    p5.setup = () => 
    {
        // new p5.Canvas(1280, 720);
        p5.noCanvas();
        p5.allSprites.autoDraw = false;
        p5.allSprites.removeAll()

        roomsDatas.get(room).setLevel(0, LEVELS)

        new p5.Tiles(roomsDatas.get(room).currentLevel.levelTilesRows, 0, 0, TILESIZE.x, TILESIZE.y)
        // p5.world.gravity.y = 10
        //verstuur hierboven de levels ofzo? doe dan onderaan de al verzonden sprite-posities updaten?!
    
        let playerOne;
        p5.allSprites.forEach(sprite => {if(sprite.tile=='p') playerOne=sprite;})


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
        // p5.selectables.pressedKeys = roomsDatas.get(room).p2.pressedKeys;
        // playerGroup.pressedKeys = roomsDatas.get(room).p1.pressedKeys
                
        //zorg dat dit niet handmatig ingevuld hoeft te worden, gebruik p5.allSprites
        const data = [];
        p5.allSprites.forEach(sprite =>{
            // sprite.currentRoom = roomsDatas.get(room)
            // sprite.update(roomsDatas.get(room).p1.pressedKeys)
            data.push({id: sprite.idNum, x: sprite.x, y: sprite.y, rot: sprite.rotation})
        })
        try{
            io.to(room).emit("gameData", data);
        } catch(err){
            console.log(err.message)
        }
        
    };
}