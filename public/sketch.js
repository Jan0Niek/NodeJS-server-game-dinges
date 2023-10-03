let socket;

let gravity = 12;
let blocks=[];
let player;
let block1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  socket = io();  //dit fixt het met dat alleen localhost werkt, nu kan ook 127.0.0.1

}

function draw() {
  background(255);
  
  circle(mouseX, mouseY, 20);

}