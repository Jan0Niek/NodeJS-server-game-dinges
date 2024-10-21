class Player extends Sprite{
    constructor(x, y, width, height, level){
        super(x, y, width, height, 'd');
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.walkSpeed = 7.5;
        this.runSpeed = 9; //no
        this.jumpStrength = 6;
        this.rotationLock = true;
        this.bounciness = 0;
        this.friction = 0.0;

        this.airborne = false;
        this.grounded = false;
        this.groundsensor = new Sprite(this.x, this.y+this.halfHeight, this.width*0.8, 5, 'n');
        this.groundsensor.visible = true;
        new GlueJoint(this, this.groundsensor).visible=false;
        this.colliding(allSprites, (player, sprite2)=>{this.isColliding(player, sprite2, level)})

        this.lastStoodOnSprite; //sprite player is standing on
        this.groundsensor.overlapping(allSprites, (player, sprite2) => {
            this.lastStoodOnSprite = sprite2;
        });
    }

    isColliding(player, sprite2, level){
        //deze if is to make sure that the player is only moving relatively along with the sprite it's standing on, not a sprite it's touching on its side 
        if(sprite2 == this.lastStoodOnSprite){
            this.y+=0.06; //nail him to the platform // nagel hem vast aan het platform
            this.x += (sprite2.pos.x - sprite2.prevPos.x);
        }

        if(level.hasOwnProperty(finish) && sprite2 == level.finish){
            console.log('next level')
            welkLevel++;
            buildLevel(welkLevel);
        }
    }

    
    control( /** @type {string[]} */ pressedKeys){ 
        this.gravityScale = 1.5;
        if (pressedKeys.includes('w') || pressedKeys.includes(' ')){
            if(this.groundsensor.overlapping(allSprites)){
                this.vel.y = -8;
                this.grounded = false;
            }
            this.gravityScale -= 0.4;
        }
        if (pressedKeys.includes('s')){
            this.gravityScale += 1.0;
        }

        if(pressedKeys.includes('a') && this.vel.x > -this.walkSpeed){
            this.applyForceScaled(-this.walkSpeed*2, 0);
        }
        if(pressedKeys.includes('d') && this.vel.x < this.walkSpeed){
            this.applyForceScaled(this.walkSpeed*2, 0);
        }
        if(pressedKeys.includes('r')){
            buildLevel(welkLevel);
        }

        this.vel.x *= 0.98;
    }
}

module.exports = Player;