let socket;

let gravity = 12;
let blocks=[];
let player;
let block1;
let chosenUsername;
let otherPlayers = {};
let myuuid;

class OtherPlayer {
  constructor(uuid, username){
      this.uuid = uuid;
      this.username = username;
      this.x=0;
      this.y=0;

  }
  update(){
      
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  socket = io({transports: ['websocket'], upgrade: false});;  //dit fixt het met dat alleen localhost werkt, nu kan ook 127.0.0.1
  chosenUsername = prompt("Type your username", "xX_GAMER_Xx");
  socket.emit("join", chosenUsername);  
  socket.on("uuid", (uuid) => {
    myuuid = uuid;
  });
  socket.emit("giveSockets");
  socket.on("giveSockets", (players) => {
    console.log("Others in the lobby: ");
    //server uuid-name pair to player Object with uuid and username
    for(let playeruuid in players){
      otherPlayers[playeruuid] = new OtherPlayer(playeruuid, players[playeruuid]);
      console.log(players[playeruuid]);
    }
  })

  console.log("my id: " + socket.id);
  socket.on("join" , (uuid, username) => {
    console.log(username + " has joined. ");
    let otherPlayer = new OtherPlayer(uuid, username);
    otherPlayers[uuid] = otherPlayer;
    console.log(otherPlayers);
  });
  socket.on("disconnected", (uuid, username) => {
    console.log(username + " left.")
    delete otherPlayers[uuid];
  })
  socket.on("position", (data, username1) => {
    otherPlayers[data.uuid].x = data.x;
    otherPlayers[data.uuid].y = data.y;
  });
}

function draw() {
  background(255);
  for(let playeruuid in otherPlayers){
    let otherPlayer = otherPlayers[playeruuid];
    circle(otherPlayer.x, otherPlayer.y, 20);
    text(otherPlayer.username, otherPlayer.x, otherPlayer.y-10);
  }

  const data = {
    uuid: myuuid,
    x: mouseX, 
    y: mouseY
  }
  text(chosenUsername, data.x, data.y-10);
  circle(data.x, data.y, 20);
  socket.emit("position", data);
}