function declarePlayer(){

    return class Player extends Sprite{
        constructor(x, y, width, height){
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
            this.colliding(allSprites, this.isColliding)

            this.lastStoodOnSprite; //sprite player is standing on
            this.groundsensor.overlapping(allSprites, (player, sprite2) => {
                this.lastStoodOnSprite = sprite2;
            });
        }

        isColliding(player, sprite2){
            //deze if is to make sure that the player is only moving relatively along with the sprite it's standing on, not a sprite it's touching on its side 
            if(sprite2 == this.lastStoodOnSprite){
                this.y+=0.06; //nail him to the platform // nagel hem vast aan het platform
                this.x += (sprite2.pos.x - sprite2.prevPos.x);
            }

            if(sprite2 == level.finish){
                console.log('next level')
                welkLevel++;
                buildLevel(welkLevel);
            }
        }


        control(){ 
            this.gravityScale = 1;
            if (kb.pressing('w') || kb.pressing(' ')){
                if(this.groundsensor.overlapping(allSprites)){
                    this.vel.y = -8;
                    this.grounded = false;
                }
                this.gravityScale -= 0.4;
            }
            if (kb.pressing('s')){
                this.gravityScale += 1.0;
            }

            if(kb.pressing('a') && this.vel.x > -this.walkSpeed){
                this.applyForceScaled(-this.walkSpeed*2, 0);
            }
            if(kb.pressing('d') && this.vel.x < this.walkSpeed){
                this.applyForceScaled(this.walkSpeed*2, 0);
            }

            this.vel.x *= 0.98;
        }
    }
}