let socket;

let gravity = 12;
let blocks=[];
let player;
let block1;
let chosenUsername;
let otherPlayers = {};
let myuuid;

function setup() {
  createCanvas(windowWidth, windowHeight); //moet dit nog aanpassen, dit is niet perfect zeg maar
  textStyle(BOLD);
  strokeWeight(1);
  // socket = io({transports: ['websocket'], upgrade: false});
  // chosenUsername = prompt("Type your username", "xX_GAMER_Xx");

  button1 = new Button(60, 100, 120, 45, "Knopje 1", [255, 0, 0], 20,[120, 120, 255], [100, 255, 100]);
  
  socket.emit("join", chosenUsername);  
  socket.on("uuid", (uuid) => {
    myuuid = uuid;
    console.log("my id: " + socket.id);
    console.log("my uuid: " + myuuid); 
  });
  socket.on("giveSockets", (players) => {
    console.log("Others in the lobby: ");
    //gets others in the lobby/server from the server's uuid+name pair, converts that to player Object with uuid and username
    for(let playeruuid in players){
      otherPlayers[playeruuid] = new OtherPlayer(playeruuid, players[playeruuid]);
      console.log(players[playeruuid]);
    }
  })

  socket.on("join" , (uuid, username) => {
    //adds a new join to player list
    console.log(username + " has joined. ");
    let otherPlayer = new OtherPlayer(uuid, username);
    otherPlayers[uuid] = otherPlayer;
  });
  socket.on("disconnected", (uuid, username) => {
    //removes people who have left from the client
    console.log(username + " left.")
    delete otherPlayers[uuid];
  })
  socket.on("position", (data) => {
    //sets playerObject's x and y if changed
    otherPlayers[data.uuid].x = data.x;
    otherPlayers[data.uuid].y = data.y;
  });

}

function draw() {
  button1.draw(mouseX, mouseY);
}


function gameScene(){
  background(255);
  for(let playeruuid in otherPlayers){
    //draws other players at their positions
    let otherPlayer = otherPlayers[playeruuid];
    circle(otherPlayer.x, otherPlayer.y, 20);
    text(otherPlayer.username, otherPlayer.x, otherPlayer.y-10);
  }

  
  //draws own player and sends position to others
  const data = {
    uuid: myuuid,
    x: mouseX, 
    y: mouseY
  }
  text(chosenUsername, data.x, data.y-10);
  circle(data.x, data.y, 20);
  socket.emit("position", data);
}

function lobbiesScene(){
  quickGameButton = new Button(oasijd)
}