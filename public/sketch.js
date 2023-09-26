let socket;

let gravity = 12;
let blocks=[];
let player;
let block1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  socket = io();  //dit fixt het met dat alleen localhost werkt, nu kan ook 127.0.0.1
  
  block1 = new Block(20, 500, 220, 40, [0, 255, 0]);
  block2 = new Block(200, 400, 40, 200, [20, 200, 20]);
  block3 = new Block(70, 100, 444, 30, [255, 20, 30]);
  blocks.push(block1, block2, block3);
  player = new Player(50, 120, 2);

  frameRate(60);
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