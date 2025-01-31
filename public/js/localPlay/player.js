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

function declarePlayer(){
    let playerGroup = new Group(); //om de een of andere reden werkt dit (tile) alleen als group, niet als sprite... bruh
    playerGroup.tile = 'p';
    playerGroup.w = TILESIZE.x
    playerGroup.h = TILESIZE.h*2
    playerGroup.rotationLock = true;
    playerGroup.friction = 0;

    playerGroup.jumpStrength = 6;
    playerGroup.movementspeed = 4;
    playerGroup.movingspeed = 0;
    playerGroup.grounded = false;
    playerGroup.jumpingAble = false
    playerGroup.coyoteTime = 100; //miliseconds

    playerGroup.setup = function(){
        this.groundSensor = new Sprite(this.x, this.y+this.halfHeight, this.w, 1)
        this.groundSensorGlue = new GlueJoint(this, this.groundSensor)
        this.groundSensor.visible=false;
        this.groundSensorGlue.visible=false;

    }

    playerGroup.update = function(){
        if((kb.presses(' ') || kb.presses('w')) && this.grounded){
            this.vel.y = -this.jumpStrength
            this.grounded = false;
        }
        if(this.groundSensor.overlapping(allSprites)){
            this.grounded = true;
        }       
        if(this.groundSensor.overlapped(allSprites)){
            setTimeout(()=>{
                if(!this.groundSensor.overlapping(allSprites)) this.grounded = false;
            }, this.coyoteTime)
        }
        

        // this.vel.x = 0 
        // comment hieronderaan is ongeldig aangezien ik überhaupt al geen velocity's gebruik volgens mij dan ofzo
        if(kb.pressing('a')){
            this.x += -this.movementspeed
        }
        if(kb.pressing('d')){
            this.x +=  this.movementspeed
        }

        // this.vel.x *= 0.98
        //ik zou movement moeten lerp'en ofzoiets om het soepeler te maken dan een accel van ∞
    }
}