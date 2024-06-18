function declareBlock(){
    return class Block extends Sprite{
        constructor(x, y, width, height, maxSpeed){
            super(x, y, width, height, 'd');
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.maxSpeed = maxSpeed;
            // this.colliding(allSprites, this.collision);


            this.topSensor = new Sprite(this.x, this.y-30, this.width, 18, 'n');
            this.topSensor.visible = false;
            new GlueJoint(this, this.topSensor).visible = false;
            // this.topSensor.overlapping(allSprites, this.somethingIsOnTop)

            this.gravityScale = 0;
            this.mass=10;
        }

        control() {
            this.vel.set(0, 0);
            
            if (kb.pressing('arrowUp'))     this.vel.y -= 1;
            if (kb.pressing('arrowLeft'))   this.vel.x -= 1;
            if (kb.pressing('arrowRight'))  this.vel.x += 1;
            if (kb.pressing('arrowDown'))   this.vel.y += 1;
            this.vel.normalize();
            this.vel.set(this.vel.x*this.maxSpeed, this.vel.y*this.maxSpeed)

            
        }

        // somethingIsOnTop(block, sprite2){
        //     	sprite2.vel.y = -1
        // }
    }
}