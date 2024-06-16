function declarePlayer(){

    // let topCollider = new Sprite()
    // let bottomCollider = new Sprite();
    // let leftCollider = new Sprite();
    // let rightCollider = new Sprite();

    return class Player extends Sprite{
        constructor(x, y, width, height){
            super(x, y, width, height, 'd');
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.walkSpeed = 7.5;
            this.runSpeed = 9;
            this.jumpStrength = 6;
            this.rotationLock = true;
            // this.bounciness = 0;
            // this.p_speed = 0;
            // this.min_p_speed = 60;
            // this.isRunning = false;
            // this.xSpeed = 0;
            // this.ySpeed = 0;
            // this.friction = 0.4;
            this.airborne = false; //deze zijn beide ongebruikt...
            this.grounded = false; //voeg wat van die colliders toe van andere sprites om dit te checken!!!
            this.colliding(allSprites, this.isColliding)
            this.groundsensor = new Sprite(this.x, this.y+this.halfHeight+6, this.width, 20, 'n');
            this.groundsensor.visible = false;
            new GlueJoint(this, this.groundsensor).visible=false;
        }

        isColliding(player, sprite){

        }


        control(){ //movement moet meer als mario, dus met p-speed en air-movement anders dan land en ook skidding 
            // ook moet je op een bewegend platform gewoon vastgeplakt zitten, niet met friction eraf kunnen glijden
            // spatie in mid-air moet zo'n twirl zijn om in de lucht te kunnen draaien, anders moet het lastiger zijn om in de lucht te sturen (this.grounded?)

            this.gravityScale = 1;
            if (kb.pressing('w') || kb.pressing(' ')){
                if(this.groundsensor.overlapping(allSprites)){
                    this.vel.y = -10;
                    this.grounded = false;
                }
                this.gravityScale = 0.7;
            }

            if(kb.pressing('a') && this.vel.x > -this.walkSpeed){
                this.applyForceScaled(-this.walkSpeed*2, 0);
            }
            if(kb.pressing('d') && this.vel.x < this.walkSpeed){
                this.applyForceScaled(this.walkSpeed*2, 0);
            }

            // if(kb.pressing('a') && this.vel.x < -this.walkSpeed){
            //     this.friction = 0;
            // }
            // if(kb.pressing('d') && this.vel.x > this.walkSpeed){
            //     this.friction = 0;
            // }

        }
    }

    // function declareColliders(player){
    //     topCollider = new Sprite()
    //     bottomCollider = new Sprite(player.x, player.y+player.halfwidth+7, player.width, 6);
    //     bottomCollider.debug = true
    //     bottomCollider.colliding(allSprites)
    //     leftCollider = new Sprite();
    //     rightCollider = new Sprite();
    // }
}