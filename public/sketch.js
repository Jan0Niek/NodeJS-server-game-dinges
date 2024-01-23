let socket;

let gravity = 12;
let blocks=[];
let player;
let block1;
let chosenUsername = window.sessionStorage.getItem("username");
let otherPlayers = {};

function setup() {
  createCanvas(windowWidth, windowHeight); //moet dit nog aanpassen, dit is niet perfect zeg maar
  textStyle(BOLD);
  strokeWeight(1);
  socket = io({transports: ['websocket'], upgrade: false});

  socket.on("giveSockets", (players) => {
    console.log("Others in the lobby: ");
    //gets others in the lobby/server from the server's id+name pair, converts that to player Object with id and username
    for(let idnusername in players){
      
    }
  })

  socket.on("join" , (id, username) => {
    //adds a new join to player list
    console.log(username + " has joined. ");
    let otherPlayer = new OtherPlayer(id, username);
    otherPlayers[id] = otherPlayer;
  });
  socket.on("disconnected", (id, username) => {
    //removes people who have left from the client
    console.log(username + " left.")
    delete otherPlayers[id];
  })
  socket.on("position", (data) => {
    //sets playerObject's x and y if changed
    otherPlayers[data.id].x = data.x;
    otherPlayers[data.id].y = data.y;
  });

}

function draw() {
  background(255);
  for(let playerid in otherPlayers){
    //draws other players at their positions
    let otherPlayer = otherPlayers[playerid];
    circle(otherPlayer.x, otherPlayer.y, 20);
    text(otherPlayer.username, otherPlayer.x, otherPlayer.y-10);
  }

  
  //draws own player and sends position to others
  const data = {
    id: myid,
    x: mouseX, 
    y: mouseY
  }
  text(chosenUsername, data.x, data.y-10);
  circle(data.x, data.y, 20);
  socket.emit("position", data);
}
