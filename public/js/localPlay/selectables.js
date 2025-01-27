function declareSelectables(TILESIZE){
    // class Block extends Sprite{
    //     static tile = 'b';
    //     constructor(x, y, width, height){
    //         super(x, y, width, height, 'k');
    //         this.x = x;
    //         this.y = y;
    //         this.width = width;
    //         this.height = height;
    //         this.maxSpeed = 3;

    //         // this.canRotate = canRotate;

    //         // this.x1 = x1;
    //         // this.y1 = y1;

    //         // this.x2 = x2;
    //         // this.y2 = y2;

    //         this.gravityScale = 0;
    //         this.mass=10;
            
    //         this.rotationLock = true;
    //         this.selected = false;
    //         this.stroke = color(0);
    //         this.strokeWeight = 2;
    //         this.colliding(allSprites, this.isColliding);
    //     }

    //     isColliding(block, sprite2){
    //         if (kb.pressing('arrowUp'))     return;
    //         if (kb.pressing('arrowDown'))   return;
    //         this.y -= (this.pos.y - this.prevPos.y);

    //         if (kb.pressing('arrowLeft'))   return;
    //         if (kb.pressing('arrowRight'))  return;
    //         this.x -= (this.pos.x - this.prevPos.x);
    //     }
    //     control() {
    //         this.vel.set(0, 0);
            
    //         if(this.selected == true){
    //             if (kb.pressing('arrowUp'))     this.vel.y -= 1;
    //             if (kb.pressing('arrowLeft'))   this.vel.x -= 1;
    //             if (kb.pressing('arrowRight'))  this.vel.x += 1;
    //             if (kb.pressing('arrowDown'))   this.vel.y += 1;
    //             this.vel.normalize();
    //             this.vel.set(this.vel.x*this.maxSpeed, this.vel.y*this.maxSpeed)
    //         }
            
    //     }

    //     toggleSelection(blocks){
    //         if(this.mouse.presses()){
    //             blocks.forEach(block => {
    //                 block.selected = false;
    //                 block.stroke = color(0);
    //                 block.collider = 'k';
    //             });
    //             enemies.forEach(enememytje => {
    //                 enememytje.selected = false;
    //                 enememytje.stroke = color(0);
    //                 enememytje.shootSpeed = 300;
    //                 });
    //             this.selected = true;
    //             this.stroke = new Color(255, 0, 255);
    //             this.collider = 'd';
    //         }
    //     }

    //     // rotateBlock(){
    //     //     if(this.canRotate == true){
    //     //         this.rotate(1, 1);
    //     //     }
    //     // }

        
    //     // moveBetweenPoints(x1, x2, y1, y2){
    //     //     if(this.pos.x == x1 && this.pos.y == y1){ 
    //     //         this.moveTo(x2, y2, 0.03);
    //     //     }
    //     //     if(this.pos.x == x2 && this.pos.y == y2){ 
    //     //         this.moveTo(x1, y1, 0.03);
    //     //     }
    //     // }
    // }

    let selectables = new Group()
    // selectables.collider = 'k'
    selectables.selected = false
    selectables.w = TILESIZE.x
    selectables.h = TILESIZE.y
    selectables.color = color(100, 200, 100)

    selectables.checkSelection = function(){
        selectables.forEach(selectable =>{
            if (selectable.mouse.presses()) {
                // console.log("selectable was pressed!" + selectable.idNum);
                
                selectable.color = random(0, 255)
                selectables.forEach(selectable => {
                    selectable.selected = false
                });
                selectable.selected = true
            }
        })

        selectables.horizontalInput = 0
        selectables.verticalInput = 0
        if(kb.pressing('arrowRight')) selectables.horizontalInput += 1
        if(kb.pressing('arrowLeft'))  selectables.horizontalInput -= 1
        if(kb.pressing('arrowDown'))  selectables.verticalInput += 1
        if(kb.pressing('arrowUp'))    selectables.verticalInput -= 1
    }
    selectables.update = function(){ selectables.checkSelection() }



    let blocks = new selectables.Group();
    blocks.collider = 'k'
    blocks.movementspeed = 4
    blocks.rotationLock = true //maybe rotating blocks someday
    blocks.tile = 'b'

    blocks.stopGlideMovement = function(){
        if(selectables.verticalInput !== 0)   return;
        this.y -= (this.pos.y - this.prevPos.y);

        if(selectables.horizontalInput !== 0)  return;
        this.x -= (this.pos.x - this.prevPos.x);
    }
    blocks.movement = function(){
        this.velocity.set(0, 0)
        this.vel.x += selectables.horizontalInput*this.movementspeed
        this.vel.y += selectables.verticalInput*this.movementspeed
    }
    blocks.update = function(){
        selectables.checkSelection()
        //how 'this' works in js is a mess... hate it
        if (this.selected) {
            this.collider = 'd'
            this.stopGlideMovement()
            this.movement()
        } else {
            this.vel.set(0, 0) // have seriously no clue why i have to set their velocity to nil, they should be of collider kinematic and thusly not move...
            this.collider = 'k'
        }
    }
    //maak blocks.draw function ooit!!
    
    let selectableEnemies = new selectables.Group()
    selectableEnemies.shape = 'triangle';
    selectableEnemies.movementspeed = 3

    selectableEnemies.collides(allSprites, killCheck) //kan ook in 1x enkel collision checken met player-(group?)
    
    function killCheck(enemy, col){
        if(col.tile == 'p'){
            //dan restart level ofzo
        }
    }

    selectableEnemies.normalMovement = function(){
        //zorg dat--e heen en weer beweegt, mogelijk met 2 ge-GlueJointe sensoren
    }
    selectableEnemies.controlledMovement = function(){
        selectableEnemies.velocity.set(0, 0)
        
        selectableEnemies.vel.x += selectables.horizontalInput*selectableEnemies.movementspeed
    }

    selectableEnemies.update = function(){
        if (selectableEnemies.selected) {
            selectableEnemies.controlledMovement()
        } else {
            selectableEnemies.normalMovement()
        }
    }
}