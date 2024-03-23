new Q5();

//maak hier de custom classes aan (van andere bestanden)
let Block = declareBlock();

//hier de overige set-up and such
new Canvas(900, 500)
world.gravity.y = 9.81;

let sprit = new Sprite(50, 50, 50, 50);
sprit.friction = 100;

new Sprite (width/2, height-9, width, 20, 'k')
let ablock = new Block(10, 10, 100, 40, 3);

//main game loop enz
function draw(){
    background(0, 123, 123);
    ablock.control()
    sprit.rotation = 0;

}