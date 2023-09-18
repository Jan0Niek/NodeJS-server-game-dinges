let socket;

function setup() {
  createCanvas(400, 400);
  socket = io.connect('http://localhost:3000');  
  socket.on('mouse', data => {
    rect(data.x, data.y, 20, 20);
  });
}

function draw() {
  line(10, 20, 180, 160);
  
  // color()
}

function mouseMoved(){
  let data = {
    x: mouseX,
    y: mouseY
  }
  socket.emit('mouse', data);
  rect(data.x, data.y, 20, 20);
}