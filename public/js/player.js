function declarePlayer(){
    return class Player extends Sprite{
        constructor(x, y, width, height){
            super(x, y, width, height, 'd');
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.walkSpeed = 12;
            this.runSpeed = 8;
            this.jumpStrength = 6;
            // this.friction = 0.8;
            this.rotationLock = true;
            // this.bounciness = 0;
            // this.p_speed = 0;
            // this.min_p_speed = 60;
            // this.isRunning = false;
            // this.xSpeed = 0;
            // this.ySpeed = 0;
        }

        control(){ //movement moet meer als mario, dus met p-speed en air-movement anders dan land en ook skidding 
            // ook moet je op een bewegend platform gewoon vastgeplakt zitten, niet met friction eraf kunnen glijden
            // spatie in mid-air moet zo'n twirl zijn om in de lucht te kunnen draaien, anders moet het lastiger zijn om in de lucht te sturen (this.grounded?)
            
            if (kb.pressing('w') || kb.pressing(' ')) this.jump();

            if(kb.pressing('a') && this.vel.x > -this.walkSpeed){
                this.applyForceScaled(-this.walkSpeed, 0);
            }
            if(kb.pressing('d') && this.vel.x < this.walkSpeed){
                this.applyForceScaled(this.walkSpeed, 0);
            }

        }
        jump(){
            if(this.colliding(allSprites)){
                this.vel.y = -10;
            }
        }
    }
}