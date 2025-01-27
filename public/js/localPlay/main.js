new Q5();


new Canvas(1280, 720)
world.gravity.y = 9.81;
allSprites.drag = 0.24;
world.allowSleeping = false;
p5play.renderStats = true

//global tilesize in px
const TILESIZE = {x:40, y:40};
allSprites.w = TILESIZE.x
allSprites.h = TILESIZE.y

//maak hier de custom classes aan (van andere bestanden)
declareSelectables()



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


let theLevels;
async function buildLevel(welkLevel){
    allSprites.remove()
    theLevels = await loadTheLevels()
    // for (let rowNumber = 0; rowNumber < theLevels[welkLevel].levelTilesRows.length; rowNumber++) {
    //     const currentRow = theLevels[welkLevel].levelTilesRows[rowNumber];
    //     for (let column = 0; column < currentRow.length; column++) {
    //         const currentTile = currentRow[column];
    //         for (const tile_choice of TILE_CHOICES) {
    //             if(tile_choice.tile == currentTile) new tile_choice(TILESIZE.x*column, TILESIZE.y*rowNumber, TILESIZE.x, TILESIZE.y) 
    //         }
    //     }
    // }
    new Tiles(theLevels[welkLevel].levelTilesRows, 0, 0)
}

async function setup(){
    await buildLevel(welkLevel);
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
    text(    camera.x, 100, 15    )
    text("FPS: "+frameRate().toFixed(2) + "   deltaTime: "+deltaTime.toFixed(2), 0, 35);
    text('xpos: ' + playertje.x.toFixed(1) + '   ypos: ' + playertje.y.toFixed(1), 0, 70);
    text('xvel: ' + playertje.vel.x.toFixed(1) + '   yvel: ' + playertje.vel.y.toFixed(1), 0, 105);

    text(playertje.friction, 800, 20)

}