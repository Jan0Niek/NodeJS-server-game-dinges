"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let thing;
let floor; //typescript?
let canvas;
let Player = declarePlayer();
function setup() {
    canvas = new Canvas(500, 500);
    world.gravity.y = 9.81;
    thing = new Player(70, 70, 20, 40);
    new Sprite(130, 150, 20, 20);
    floor = new Sprite(250, canvas.height, canvas.width, 14, 'k');
}
function draw() {
    background('gray');
    floor.y--;
}
