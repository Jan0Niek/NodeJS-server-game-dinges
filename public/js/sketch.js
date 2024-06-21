let chosenUsername = window.sessionStorage.getItem("username");

let otherPlayers = {};

function setup() {
  createCanvas(1280, 720);
  textStyle(BOLD);
  strokeWeight(1);
  
}

function draw() {
  background(255);
  text(chosenUsername, mouseX, mouseY)
  for (const [key, value] of Object.entries(otherPlayers)){
    text(value.username, value.x, value.y);
  }
  
}

function mouseMoved(){
  const data = {
    x: mouseX, 
    y: mouseY, 
    id: socket.id
  }
  updatePosition(data)
}

function updateOtherPlayerPosition(data){
  otherPlayers[data.id].x = data.x;
  otherPlayers[data.id].y = data.y;
}

function addOtherPlayer(id, username){
  otherPlayers[id] = new OtherPlayer(id, username);
}