let socket;

let gravity = 12;
let blocks=[];
let player;
let block1;
let chosenUsername;
let otherPlayers = {};

function setup() {
  createCanvas(windowWidth, windowHeight);
  socket = io();  //dit fixt het met dat alleen localhost werkt, nu kan ook 127.0.0.1
  chosenUsername = prompt("Type your username", "xX_GAMER_Xx");
  socket.emit("join", chosenUsername);

  console.log(new OtherPlayer("hoi", "naampje"));
  

  console.log("my id: " + socket.id);
  socket.on("join" , (id, username) => {
    let otherPlayer = new OtherPlayer(id, username);
    console.log(otherPlayer);
    otherPlayers[id] = otherPlayer;
    console.log(otherPlayers);
  });
  socket.on("position", (data, username1) => {
    otherPlayers[data.id].x = data.x;
    otherPlayers[data.id].y = data.y;
  });
}

function draw() {
  background(255);
  for(let playerID in otherPlayers){
    let otherPlayer = otherPlayers[playerID];

    circle(otherPlayer.x, otherPlayer.y, 20);
    text(otherPlayer.username, otherPlayer.x, otherPlayer.y-10);
  }

  const data = {
    id: socket.id,
    x: mouseX, 
    y: mouseY
  }
  text(chosenUsername, data.x, data.y-10);
  circle(data.x, data.y, 20);
  socket.emit("position", data);
}