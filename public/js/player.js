function declarePlayer(){
    return class Player extends Sprite{
        constructor(x, y, width, height, walkSpeed, runSpeed, jumpStrength){
            super(x, y, width, height, 'd');
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.walkSpeed = walkSpeed;
            this.runSpeed = runSpeed;
            this.jumpStrength = jumpStrength;
            // this.friction = friction;
            this.rotationLock = true;
            // this.bounciness = 0;
            // this.drag = drag;
            this.p_speed = 0;
            this.min_p_speed = 60;
            this.isRunning = false;
        }

        control(){ //movement moet meer als mario, dus met p-speed en air-movement anders dan land en ook skidding 
            // ook moet je op een bewegend platform gewoon vastgeplakt zitten, niet met friction eraf kunnen glijden
            // spatie in mid-air moet zo'n twirl zijn om in de lucht te kunnen draaien, anders moet het lastiger zijn om in de lucht te sturen (this.grounded?)
            this.isRunning = false;
            if (kb.pressing('w') || kb.pressing(' ')) this.jump()

            this.p_speed = kb.pressing('shift'); //moet controls configurabel maken eigenlijk
            if(this.p_speed >= this.min_p_speed) this.isRunning = true;
            
            if(kb.pressing('a')){
                if(this.isRunning){
                    this.x -= this.runSpeed;
                }else{
                    this.x -= this.walkSpeed + this.p_speed * 0.05; //magic numbers, geen idee hoe dit variabel zou heten
                }
            }
            if(kb.pressing('d')){
                if(this.isRunning){
                    this.x += this.runSpeed;
                }else{
                    this.x += this.walkSpeed + this.p_speed * 0.05;
                }
            }
        }
        jump(){
            if(this.colliding(allSprites)){
                this.vel.y = -10;
            }
        }
    }
}