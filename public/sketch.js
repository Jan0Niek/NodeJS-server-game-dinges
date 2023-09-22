let socket;

let gravity = 12;
let blocks=[];
let player;
let block1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  socket = io();  //dit fixt het met dat alleen localhost werkt, nu kan ook 127.0.0.1
  
  block1 = new Block(20, 360, 220, 40, [0, 255, 0]);
  block2 = new Block(200, 300, 40, 40, [20, 200, 20]);
  blocks.push(block1, block2);
  player = new Player(50, 120, 2);

}

function draw() {
  background(255);
  text(frameRate(), 20, 20);
  
  //moet alle movement nog *deltaTime doen argh
  player.platformGravityJumpHeightSideMovementSpeedFriction(1, 3.6, 2, 0.8, blocks);
  player.draw();
  blocks.forEach(block => {
    block.draw();
  });

}