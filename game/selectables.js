function declareSelectables(TILESIZE, p5){
    let selectables = new p5.Group()
    // selectables.collider = 'k'
    selectables.selected = false
    selectables.w = TILESIZE.x
    selectables.color = p5.color(100, 200, 100)

    selectables.friction=0
    selectables.pressedKeys = []

    selectables.checkSelection = function(){
        // selectables.pressedKeys = pressedKeys
            selectables.forEach(selectable => {
                //mouse.presses moet veranderd worden!!!!!!! die kan nie!
                if (selectable.mouse.presses()) {
                    selectables.forEach(selectable => {
                        // idk why just setting it to false for the whole group doesnt work or something like selectables.selected = () => false but another forEach works ig
                        selectable.selected = false
                    })
                    // console.log("selectable was pressed!" + selectable.idNum);
                    
                    selectable.color = random(0, 255)
                    selectable.selected = true
                }
            })

        selectables.horizontalInput = 0
        selectables.verticalInput = 0
        if(selectables.pressedKeys.includes('d'))  selectables.horizontalInput += 1
        if(selectables.pressedKeys.includes('a'))  selectables.horizontalInput -= 1
        if(selectables.pressedKeys.includes('w'))  selectables.verticalInput += 1
        if(selectables.pressedKeys.includes('s'))  selectables.verticalInput -= 1
    }
    selectables.update = function(){ selectables.checkSelection() }



    let blocks = new selectables.Group();
    blocks.collider = 'k'
    blocks.movementspeed = 3
    blocks.rotationLock = true //maybe rotating blocks someday
    blocks.tile = 'b'

    function blocksRelativity(sensor, sprite2){
        if(sensor.joints[0].spriteA.selected) sprite2.vel.x = (sensor.vel.x);
        
    }

    blocks.setup = function(){
        this.topSensor = new p5.Sprite(this.x, this.y-this.halfHeight, this.w*0.9, 4, 'n');
        this.topSensorGlue = new p5.GlueJoint(this, this.topSensor);

        this.topSensor.visible=false;
        this.topSensorGlue.visible=false;

        this.topSensor.overlapping(p5.allSprites, blocksRelativity)
    }

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
    selectableEnemies.w = selectables.w*0.9
    selectableEnemies.h = 'triangle';
    selectableEnemies.collider = 'd'
    selectableEnemies.movementspeed = 0
    selectableEnemies.friction=0
    selectableEnemies.movingspeed = selectableEnemies.movementspeed //for reversing left-right movement
    selectableEnemies.tile = 'e'
    selectableEnemies.rotationLock = true


    selectableEnemies.collides(p5.allSprites, killCheck) //kan ook in 1x enkel collision checken met player-(group?)
    
    function killCheck(enemy, col){
        if(col.tile == 'p'){
            setup()
        }
    }

    selectableEnemies.addGlueJoints = function(){
        this.leftGlue  = new p5.GlueJoint(this, this.leftSensor)
        this.rightGlue = new p5.GlueJoint(this, this.rightSensor)

        this.rightGlue.visible = false;
        this.leftGlue.visible = false;
    }
    selectableEnemies.addLeftRightSensors = function(){
        this.leftSensor = new p5.Sprite(this.x-this.w*0.5, this.y-5, 5, 10, 'n')
        this.rightSensor = new p5.Sprite(this.x+this.w*0.5, this.y-5, 5, 10, 'n')

        this.leftSensor.visible = false;
        this.rightSensor.visible = false;
        // this.leftSensor.overlaps(p5.allSprites, turnRight)
        // this.rightSensor.overlaps(p5.allSprites, turnLeft)
    }
    

    selectableEnemies.normalMovement = function(){
        this.x += this.movingspeed; //ik zou dingen met velocity's en met forces moeten doen, maar zo is makkelijker

        if(this.leftSensor.overlapping(p5.allSprites)) this.movingspeed = this.movementspeed;
        if(this.rightSensor.overlapping(p5.allSprites)) this.movingspeed = -this.movementspeed;
    }
    selectableEnemies.controlledMovement = function(){
        this.velocity.x = 0
        
        this.vel.x += selectables.horizontalInput*selectableEnemies.movementspeed
    }

    selectableEnemies.setup = function(){
        this.addLeftRightSensors()
        this.addGlueJoints()
        // console.log("as")
    }

    selectableEnemies.update = function(){
        if (this.selected) {
            this.controlledMovement()
        } else {
            this.normalMovement()
        }
    }
}

module.exports = {declareSelectables}