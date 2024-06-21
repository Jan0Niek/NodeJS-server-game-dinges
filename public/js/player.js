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

            this.airborne = false; //deze zijn beide ongebruikt...
            this.grounded = false; //voeg wat van die colliders toe van andere sprites om dit te checken!!!
            this.colliding(allSprites, this.isColliding)
            this.groundsensor = new Sprite(this.x, this.y+this.halfHeight+6, this.width-8, 20, 'n');
            this.groundsensor.visible = false;
            new GlueJoint(this, this.groundsensor).visible=false;

        }

        isColliding(player, sprite){

        }


        control(){ 

            this.gravityScale = 1;
            if (kb.pressing('w') || kb.pressing(' ')){
                if(this.groundsensor.overlapping(allSprites)){
                    this.vel.y = -10;
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

        }
    }
}