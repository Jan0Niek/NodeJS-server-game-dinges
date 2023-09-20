let socket;

let gravity = 12;
let blocks;
let player;
let block1;

function setup() {
  createCanvas(800, 700);
  socket = io();  //dit fixt het met dat alleen localhost werkt, nu kan ook 127.0.0.1
  
  block1 = new Block(20, 360, 220, 40, [0, 255, 0]);
  player = new Player(50, 120, 12);

}

function draw() {
  background(255);
  player.move(key, 2);
  player.collision(block1);
  player.draw();

  block1.draw();

}