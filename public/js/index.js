new Q5();

//maak hier de custom classes aan (van andere bestanden)
let Block = declareBlock();
let Player = declarePlayer();
let Enemy = declareEnemy();
let Bullet = declareBullet();
let oneTimeUse = declareOneTimeUse();
let Finish = declareFinish();

//hier de overige set-up and such
new Canvas(1280, 720)
world.gravity.y = 9.81;
allSprites.drag = 0.24;
world.allowSleeping = false;

let tileSize;
function setTileSize(size){
    tileSize = size;
}


if(localStorage.getItem("refresh-rate") == null){
    localStorage.setItem("refresh-rate", parseInt(prompt("Wat is de refresh-rate van diens monitor (in Hertz)?")));
}
frameRate(parseInt(localStorage.getItem("refresh-rate")));

// frameRate(75);
let backgroundje = loadImage("assets/achtergrond.jpg");
textSize(15);

let welkLevel = 1;



let level;
let blocks = [];
let enemies = [];
let oneJumpBlocks = [];
let normalSprites = [];
let playertje;


function buildLevel(welkLevel){
    allSprites.remove()
    level = loadLevel(welkLevel)
    blocks = level.blocks
    enemies = level.enemies
    playertje = level.player
    normalSprites = level.normalSprites
}

buildLevel(welkLevel);

//main game loop enz
function draw(){
    // if(mouse.presses()){
    //     new Sprite(mouse.x, mouse.y, random(20, 120), random(20, 120))
    // }
    // if(mouse.presses('right')){
    //     enemies.push(new Enemy(mouse.x, mouse.y, random(4, 80), true))
    // }
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
    blocks.forEach(block => {
        block.control()
        block.toggleSelection(blocks)
        block.rotateBlock()
    });
    playertje.control()

    enemies.forEach(enememytje => {
        enememytje.moveBetweenPoints()
        enememytje.shootAtplayer()
        enememytje.jump()
        enememytje.toggleSelection(enemies)
        enememytje.control()
    });
}