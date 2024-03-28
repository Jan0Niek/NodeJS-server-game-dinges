function declarePlayer(){
    return class Player extends Sprite{
        constructor(x, y, width, height, speed, jumpStrength, friction, drag){
            super(x, y, width, height, 'd');
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.maxSpeed = speed;
            this.jumpStrength = jumpStrength;
            this.friction = friction;
            this.rotationLock = true;
            this.bounciness = 0;
            this.drag = drag;
        }

        control(){
            if (kb.pressing('w') || kb.pressing(' ')) this.jump()
            if (kb.pressing('a')){
                // this.bearing = 180;
                // this.applyForceScaled(this.maxSpeed);
                this.vel.x += -this.maxSpeed;
            }
            if (kb.pressing('d')){
                // this.bearing = 0;
                // this.applyForceScaled(this.maxSpeed);
                this.vel.x += this.maxSpeed
            }
            if (this.vel.x > 16){
                this.vel.x = 16;
            }else if(this.vel.x < -16){
                this.vel.x = -16;
            }
            // if (kb.pressing('s'))   this.vel.y += 1;
        }
        jump(){

        }
    }
}