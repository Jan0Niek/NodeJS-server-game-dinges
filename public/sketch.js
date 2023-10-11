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
  socket.on("position", (data, username1) => {
    background(255);
    // console.log("pos ontvangen")
    circle(data.x, data.y, 20)
    text(username1, data.x, data.y-10)
  });
}

function draw() {
  // background(255);

  const data = {
    id: socket.id,
    x: mouseX, 
    y: mouseY
  }
  text(username, data.x, data.y-10);
  circle(data.x, data.y, 20);
  socket.emit("position", data);
}