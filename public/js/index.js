new Q5();

//maak hier de custom classes aan (van andere bestanden)
let Block = declareBlock();
let Player = declarePlayer();

//hier de overige set-up and such
new Canvas(1900, 900)
world.gravity.y = 9.81;
allSprites.drag = 1;
world.allowSleeping = false;


new Sprite(50, 50, 50, 50).rotationLock = true;
for (let i = 0; i < 0; i++) {
    new Sprite(random(20, 900), random(20, 480), random(4, 60), random(4, 60))
}

new Sprite (width/2, height-9, width, 20, 'k')
let ablock = new Block(300, 800, 100, 40, 3);

let playertje = new Player(400, 160, 30, 100, 1, 6, 6)
// playertje.drag = 2;

//main game loop enz
function draw(){
    background(0, 123, 123);
    allSprites.draw()
    
    text(frameRate().toFixed(2), 20, 20)
    //uhuh
    ablock.control()
    playertje.control()

}