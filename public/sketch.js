let socket;

let gravity = 12;
let blocks=[];
let player;
let block1;
let username;

function setup() {
  createCanvas(windowWidth, windowHeight);
  socket = io();  //dit fixt het met dat alleen localhost werkt, nu kan ook 127.0.0.1
  username = prompt("Type your username", "xX_GAMER_Xx");
  socket.emit("username", username);

  socket.on("username", (username, id) => {

  });
  socket.on("position", (data) => {
    circle(data.x, data.y, 20)
  });
}

function draw() {
  background(255);
  
  text(username, mouseX, mouseY-10);
  circle(mouseX, mouseY, 20);
  const data = {
    id: socket.id,
    x: mouseX, 
    y: mouseY
    }
  socket.emit("position", data);

}