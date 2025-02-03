// function declarePlayer(){

//     return class Player extends Sprite{
//         static tile = 'p';
//         constructor(x, y, width, height){
//             super(x, y, width, height, 'd');
//             this.x = x;
//             this.y = y;
//             this.width = width;
//             this.height = height;
//             this.walkSpeed = 7.5;
//             this.runSpeed = 9; //no
//             this.jumpStrength = 6;
//             this.rotationLock = true;
//             this.bounciness = 0;
//             this.friction = 0.0;

//             this.airborne = false;
//             this.grounded = false;
//             this.groundsensor = new Sprite(this.x, this.y+this.halfHeight, this.width*0.8, 5, 'n');
//             this.groundsensor.visible = true;
//             new GlueJoint(this, this.groundsensor).visible=false;
//             this.colliding(allSprites, this.isColliding)

//             this.lastStoodOnSprite; //sprite player is standing on
//             this.groundsensor.overlapping(allSprites, (player, sprite2) => {
//                 this.lastStoodOnSprite = sprite2;
//             });
//             this.tile = "p";
//         }

//         isColliding(player, sprite2){
//             //deze if is to make sure that the player is only moving relatively along with the sprite it's standing on, not a sprite it's touching on its side 
//             if(sprite2 == this.lastStoodOnSprite){
//                 this.y+=0.06; //nail him to the platform // nagel hem vast aan het platform
//                 this.x += (sprite2.pos.x - sprite2.prevPos.x);
//             }

//             if(sprite2 == level.finish){
//                 console.log('next level')
//                 welkLevel++;
//                 buildLevel(welkLevel);
//             }
//         }


//         control(){ 
//             this.gravityScale = 1.5;
//             if (kb.pressing('w') || kb.pressing(' ')){
//                 if(this.groundsensor.overlapping(allSprites)){
//                     this.vel.y = -8;
//                     this.grounded = false;
//                 }
//                 this.gravityScale -= 0.4;
//             }
//             if (kb.pressing('s')){
//                 this.gravityScale += 1.0;
//             }

//             if(kb.pressing('a') && this.vel.x > -this.walkSpeed){
//                 this.applyForceScaled(-this.walkSpeed*2, 0);
//             }
//             if(kb.pressing('d') && this.vel.x < this.walkSpeed){
//                 this.applyForceScaled(this.walkSpeed*2, 0);
//             }
//             if(kb.pressing('r')){
//                 buildLevel(welkLevel);
//             }

//             this.vel.x *= 0.98;
//         }
//     }
// }

function declarePlayer(TILESIZE){
    let playerGroup = new Group(); //om de een of andere reden werkt dit (tile) alleen als group, niet als sprite... bruh
    playerGroup.tile = 'p';
    playerGroup.w = TILESIZE.x
    playerGroup.h = TILESIZE.y*2
    playerGroup.rotationLock = true;
    playerGroup.friction = 0;
    playerGroup.gravityScale = 1.5

    playerGroup.constantGravityScale = 1.5
    playerGroup.jumpStrength = 9;
    playerGroup.movementspeed = 4;
    playerGroup.movingspeed = 0;
    playerGroup.grounded = false;
    playerGroup.jumpingAble = false
    playerGroup.coyoteTime = 100; //miliseconds
    playerGroup.leftAllowed = true;
    playerGroup.rightAllowed = true;
    playerGroup.pressedKeys = [];


    playerGroup.addGlueJoints = function(){
        this.leftGlue  = new GlueJoint(this, this.leftSensor)
        this.rightGlue = new GlueJoint(this, this.rightSensor)

        this.rightGlue.visible = false;
        this.leftGlue.visible = false;
    }
    playerGroup.addLeftRightSensors = function(){
        this.leftSensor = new Sprite(this.x-this.w*0.5, this.y-(this.halfHeight*0.5 - 6), 1, this.halfHeight+6, 'n')
        this.rightSensor = new Sprite(this.x+this.w*0.5, this.y-(this.halfHeight*0.5 - 6), 1, this.halfHeight+6, 'n')

        this.leftSensor.visible = false;
        this.rightSensor.visible = false;
    }

    playerGroup.setup = function(){
        this.addLeftRightSensors()
        this.addGlueJoints()


        this.groundSensor = new Sprite(this.x, this.y+this.halfHeight, this.w*0.8, this.movementspeed)
        this.groundSensorGlue = new GlueJoint(this, this.groundSensor)
        // this.groundSensor.visible=false;
        this.groundSensorGlue.visible=false;

        this.groundSensor.overlapping(allSprites, (sensor, sprite2)=>{
            if(sprite2.vel.x == 0 && (!this.leftSensor.overlapping(allSprites) || this.rightSensor.overlapping(allSprites))) this.vel.x = 0 
                    //dit is shitcode puur omdat ik niet de al ingebouwde physics van p5play met friction gebruik, mAAR:
                    // in dat geval had ik weer andere shitcode om te voorkomen dat hij ook verticaal met platformpjes zou wrijven en dan wallslides doen;
                    //beide opties zijn matig volgens mij, deze vast het matigst. het werkt, dus..? 
        })

    }

    playerGroup.update = function(){
        this.pressedKeys = this.currentRoom.p1.pressedKeys;
        console.log(`p1 keys: ${this.pressedKeys}`)
        // this.gravityScale = this.constantGravityScale;
        //should be something different than just pressedkeys.includes(), since it's a thing you shouldn't hold, but re-press
        if((this.pressedKeys.includes(' ') || this.pressedKeys.includes('w')) && this.grounded){
            //let's just say that the double jump bug is actually a feature for the pro gamers
            this.vel.y = -this.jumpStrength;
            // this.applyForceScaled(0, -this.jumpStrength*100)
            this.grounded = false;
        }
        if(this.pressedKeys.includes(' ') || this.pressedKeys.includes('w')) this.applyForceScaled(0, -this.jumpStrength*0.6)
        // if(this.pressedKeys.includes('s')) this.applyForceScaled(0, this.jumpStrength)


        if(this.groundSensor.overlapping(allSprites)){
            this.grounded = true;
        }       
        if(this.groundSensor.overlapped(allSprites)){
            setTimeout(()=>{
                if(!this.groundSensor.overlapping(allSprites)) this.grounded = false;
            }, this.coyoteTime)
        }
        
        this.leftAllowed = true
        this.rightAllowed = true
        if(this.leftSensor.overlapping(allSprites)){
            this.leftAllowed = false
            this.x+=0.04;
        }
        if(this.rightSensor.overlapping(allSprites)){
            this.rightAllowed = false
            this.x-=0.04;
        }
        

        
        // comment hieronderaan is ongeldig aangezien ik überhaupt al geen velocity's gebruik volgens mij dan ofzo
        if(this.pressedKeys.includes('a') && this.leftAllowed){
            this.x += -this.movementspeed
        }
        if(this.pressedKeys.includes('d') && this.rightAllowed){
            this.x +=  this.movementspeed
        }

        // this.vel.x *= 0.98
        //ik zou movement moeten lerp'en ofzoiets om het soepeler te maken dan een accel van ∞
    }
}

module.exports = {declarePlayer}