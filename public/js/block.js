function declareBlock(){
    return class Block extends Sprite{
        constructor(x, y, width, height){
            super(x, y, width, height, 'k');
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.maxSpeed = 3;

            this.gravityScale = 0;
            this.mass=10;
            // this.tile = 'b';
            this.rotationLock = true;
            this.selected = false;
            this.stroke = color(0);
            this.strokeWeight = 2;
            
        }

        control() {
            this.vel.set(0, 0);
            
            if(this.selected == true){
                if (kb.pressing('arrowUp'))     this.vel.y -= 1;
                if (kb.pressing('arrowLeft'))   this.vel.x -= 1;
                if (kb.pressing('arrowRight'))  this.vel.x += 1;
                if (kb.pressing('arrowDown'))   this.vel.y += 1;
                this.vel.normalize();
                this.vel.set(this.vel.x*this.maxSpeed, this.vel.y*this.maxSpeed)
            }
            
        }

        toggleSelection(blocks){
            if(this.mouse.presses()){
                blocks.forEach(block => {
                    block.selected = false;
                    block.stroke = color(0);
                    block.collider = 'k';
                });
                this.selected = true;
                this.stroke = new Color(255, 0, 255);
                this.collider = 'd';
                console.log("hihihiha");
            }
        }
    }
}