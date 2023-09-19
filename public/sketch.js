let socket;

function setup() {
  createCanvas(400, 400);
  socket = io();  //dit fixt het met dat alleen localhost werkt, nu kan ook 127.0.0.1
  
  socket.on('typed', data => {
    text(data.key, data.x, data.y);
  });
}

function draw() {
  line(10, 20, 180, 160);
  
  // color()
}


function keyPressed(){
  const data = {
    x: mouseX, 
    y: mouseY,
    key: key
  }
  socket.emit('typed', data);
  text(data.key, data.x, data.y);
}