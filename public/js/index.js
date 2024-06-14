new Q5();

//maak hier de custom classes aan (van andere bestanden)
let Block = declareBlock();
let Player = declarePlayer();
        

//hier de overige set-up and such
new Canvas(windowWidth-4, windowHeight-4)
world.gravity.y = 9.81;
allSprites.drag = 0.24;
world.allowSleeping = false;
let backgroundje = loadImage("assets/achtergrond.jpg")


new Sprite(50, 50, 50, 50).rotationLock = true;
new Sprite(900, 700, 100, 100, 'k')
for (let i = 0; i < 30; i++) {
    new Sprite(random(20, 900), random(20, 480), random(4, 60), random(4, 60))
}

new Sprite (width/2, height-18, 1000000, 20, 'k')
let ablock = new Block(300, 800, 100, 40, 3);

let playertje = new Player(400, 160, 30, 100)
// playertje.drag = 2;

//main game loop enz
function draw(){
    camera.on()
    background(0, 123, 123);
    
    //looping background
    image(backgroundje, backgroundje.width*(-1+floor(camera.x/backgroundje.width)), 0)
    image(backgroundje, backgroundje.width*floor(camera.x/backgroundje.width), 0)
    image(backgroundje, backgroundje.width*(1+floor(camera.x/backgroundje.width)), 0)
    
    if (this.isSelected) {
        strokeWeight(2);
        stroke(255); // Highlight selected block with white border
    } else {
        noStroke();}

    allSprites.draw()
    
    let deltaX = playertje.x - camera.x;
    camera.x += deltaX * 0.1;
    
    camera.off()
    text(frameRate().toFixed(2), 20, 20)
    text(    floor(camera.x/backgroundje.width), 100, 100    )

    //uhuh
    ablock.control()
    ablock.handleClick()
    // ablock.collision()
    playertje.control()

}