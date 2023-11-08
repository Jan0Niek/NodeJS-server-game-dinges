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
  block3 = new Block(70, 60, 444, 30, [255, 20, 30]);
  blocks.push(block1, block2, block3);
  player = new Player(50, 120, 2);

  frameRate(60);
}

function draw() {
  background(255);
  text(frameRate(), 20, 20);
  blocks.forEach(block => {
    block.move(2);
    block.draw();
  });
  //movement done
  player.platformGravityJumpHeightSideMovementSpeedFriction(0.9, 24, 2, 0.8, blocks);
  player.draw();

}

function deselectAllBlocks() {
  blocks.forEach(block => {
    block.chosen = false;
  });
}

function mousePressed() {
  deselectAllBlocks(); 
  blocks.forEach(block => {
    if (
      mouseX >= block.x &&
      mouseX <= block.x + block.width &&
      mouseY >= block.y &&
      mouseY <= block.y + block.height
      ){
        block.toggleColor();
      }
  });
}

