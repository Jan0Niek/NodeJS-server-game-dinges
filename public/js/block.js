function declareBlock(){
    return class Block extends Sprite{
        constructor(x, y, width, height, maxSpeed){
            super(x, y, width, height, 'k');
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.maxSpeed = maxSpeed;
            
            this.tile = 'b';
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
    }
}