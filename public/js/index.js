new Q5();

//maak hier de custom classes aan (van andere bestanden)
let Block = declareBlock();

//hier de overige set-up and such
new Canvas(500, 500);
world.gravity.y = 9.81;

new Sprite(50, 50, 50, 50);

new Sprite (width/2, height-9, width, 20, 'k')
let ablock = new Block(10, 10, 10, 10, 10);

//main game loop enz
function draw(){
    background(123, 123, 123);
    ablock.control()

}