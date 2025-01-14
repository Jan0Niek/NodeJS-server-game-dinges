new Q5();


//maak hier de custom classes aan (van andere bestanden)
let Block = declareBlock();
let Player = declarePlayer();
let Enemy = declareEnemy();
let Bullet = declareBullet();
let oneTimeUse = declareOneTimeUse();
let Finish = declareFinish();

const TILE_CHOICES = [Player, Block, Enemy, Bullet, oneTimeUse, Finish, Sprite]
//hier de overige set-up and such
new Canvas(1280, 720)
world.gravity.y = 9.81;
allSprites.drag = 0.24;
world.allowSleeping = false;

//global tilesize in px
const TILESIZE = {x:40, y:40};


if(localStorage.getItem("refresh-rate") == null || isNaN(localStorage.getItem("refresh-rate"))){
    localStorage.setItem("refresh-rate", parseInt(prompt("Wat is de refresh-rate van diens monitor (in Hertz)?")));
}
frameRate(parseInt(localStorage.getItem("refresh-rate")));

// frameRate(75);
let backgroundje = loadImage("assets/achtergrond.jpg");
textSize(15);

let welkLevel = 0;

async function loadTheLevels(){
    try{
        const apiCallPromise  = await fetch('assets/levels.json'); //stomme code
        const apiCallObj = await apiCallPromise.json();
        return apiCallObj;
     }
     catch(error){
        console.error(error);
     };
    
}

let level;
let blocks = [];
let enemies = [];
let oneJumpBlocks = [];
let normalSprites = [];
let playertje = new Player(10, 10, 10, 10);

let theLevels;
async function buildLevel(welkLevel){
    allSprites.remove()
    theLevels = await loadTheLevels()
    for (let rowNumber = 0; rowNumber < theLevels[welkLevel].levelTilesRows.length; rowNumber++) {
        const currentRow = theLevels[welkLevel].levelTilesRows[rowNumber];
        for (let column = 0; column < currentRow.length; column++) {
            const currentTile = currentRow[column];
            for (const tile_choice of TILE_CHOICES) {
                if(tile_choice.tile == currentTile) new tile_choice(TILESIZE.x*column, TILESIZE.y*rowNumber, TILESIZE.x, TILESIZE.y) // doe hier nog de x en y positie van iedere tile
            }
        }
        
    }

    // blocks = level.blocks
    // enemies = level.enemies
    // playertje = level.player
    // normalSprites = level.normalSprites
}

buildLevel(welkLevel);
noLoop()

function setup(){
    
}

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
        // block.moveBetweenPoints()
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