let socket;

function setup() {
  createCanvas(400, 400);
  socket = io('http://localhost:3000');
  // socket = io.connect('http://localhost:3000');
  
}

function draw() {
  background(220);
  line(10, 20, 180, 160)
  rect(mouseX, mouseY, 20, 20)
}
