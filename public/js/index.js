new Q5();

//maak hier de custom classes aan (van andere bestanden)
let Block = declareBlock();
let Player = declarePlayer();

//hier de overige set-up and such
new Canvas(windowWidth-4, windowHeight-4)
world.gravity.y = 9.81;
allSprites.drag = 0.24;
world.allowSleeping = false;
allSprites.text = "ja"


if(localStorage.getItem("refresh-rate") == null){
    localStorage.setItem("refresh-rate", parseInt(prompt("Wat is de refresh-rate van diens monitor (in Hertz)?")));
}
frameRate(parseInt(localStorage.getItem("refresh-rate")));

// frameRate(75);
let backgroundje = loadImage("assets/achtergrond.jpg");
textSize(15);


new Sprite(50, 50, 50, 50).rotationLock = true;
for (let i = 0; i < 5; i++) {
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
    
    
    allSprites.draw()
    
    let deltaX = playertje.x - camera.x;
    camera.x += deltaX * 0.1;
    
    camera.off()
    text(frameRate().toFixed(2), 20, 20)
    text(    floor(camera.x/backgroundje.width), 100, 15    )
    text("FPS: "+frameRate().toFixed(2) + "   deltaTime: "+deltaTime.toFixed(2), 0, 35);
    text('xpos: ' + playertje.x.toFixed(1) + '   ypos: ' + playertje.y.toFixed(1), 0, 70);
    text('xvel: ' + playertje.vel.x.toFixed(1) + '   yvel: ' + playertje.vel.y.toFixed(1), 0, 105);

    text(playertje.friction, 800, 20)
    
    //uhuh
    ablock.control()
    playertje.control()

}