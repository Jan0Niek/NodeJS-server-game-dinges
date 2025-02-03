function declarePlayer(TILESIZE, p5){
    let playerGroup = new p5.Group(); //om de een of andere reden werkt dit (tile) alleen als group, niet als sprite... bruh
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
        this.leftGlue  = new p5.GlueJoint(this, this.leftSensor)
        this.rightGlue = new p5.GlueJoint(this, this.rightSensor)

        this.rightGlue.visible = false;
        this.leftGlue.visible = false;
    }
    playerGroup.addLeftRightSensors = function(){
        this.leftSensor = new p5.Sprite(this.x-this.w*0.5, this.y-(this.halfHeight*0.5 - 6), 1, this.halfHeight+6, 'n')
        this.rightSensor = new p5.Sprite(this.x+this.w*0.5, this.y-(this.halfHeight*0.5 - 6), 1, this.halfHeight+6, 'n')

        this.leftSensor.visible = false;
        this.rightSensor.visible = false;
    }

    playerGroup.setup = function(){
        // console.log("aaaaAA!!" + typeof currentRoom.pressedKeys)
        this.addLeftRightSensors()
        this.addGlueJoints()


        this.groundSensor = new p5.Sprite(this.x, this.y+this.halfHeight, this.w*0.8, this.movementspeed)
        this.groundSensorGlue = new p5.GlueJoint(this, this.groundSensor)
        // this.groundSensor.visible=false;
        this.groundSensorGlue.visible=false;

        this.groundSensor.overlapping(p5.allSprites, (sensor, sprite2)=>{
            if(sprite2.vel.x == 0 && (!this.leftSensor.overlapping(p5.allSprites) || this.rightSensor.overlapping(p5.allSprites))) this.vel.x = 0 
                    //dit is shitcode puur omdat ik niet de al ingebouwde physics van p5play met friction gebruik, mAAR:
                    // in dat geval had ik weer andere shitcode om te voorkomen dat hij ook verticaal met platformpjes zou wrijven en dan wallslides doen;
                    //beide opties zijn matig volgens mij, deze vast het matigst. het werkt, dus..? 
        })

    }

    playerGroup.update = function(theKeys){
        this.pressedKeys = theKeys;
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


        if(this.groundSensor.overlapping(p5.allSprites)){
            this.grounded = true;
        }       
        if(this.groundSensor.overlapped(p5.allSprites)){
            setTimeout(()=>{
                if(!this.groundSensor.overlapping(p5.allSprites)) this.grounded = false;
            }, this.coyoteTime)
        }
        
        this.leftAllowed = true
        this.rightAllowed = true
        if(this.leftSensor.overlapping(p5.allSprites)){
            this.leftAllowed = false
            this.x+=0.04;
        }
        if(this.rightSensor.overlapping(p5.allSprites)){
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