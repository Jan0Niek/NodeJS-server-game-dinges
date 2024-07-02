function declareBlock(){
    return class Block extends Sprite{
        constructor(x, y, width, height, canRotate, x1, y1, x2, y2){
            super(x, y, width, height, 'k');
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.maxSpeed = 3;

            this.canRotate = canRotate;

            this.x1 = x1;
            this.y1 = y1;

            this.x2 = x2;
            this.y2 = y2;

            this.gravityScale = 0;
            this.mass=10;
            // this.tile = 'b';
            this.rotationLock = true;
            this.selected = false;
            this.stroke = color(0);
            this.strokeWeight = 2;
            this.colliding(allSprites, this.isColliding);
        }

        isColliding(block, sprite2){
            if (kb.pressing('arrowUp'))     return;
            if (kb.pressing('arrowDown'))   return;
            this.y -= (this.pos.y - this.prevPos.y);

            if (kb.pressing('arrowLeft'))   return;
            if (kb.pressing('arrowRight'))  return;
            this.x -= (this.pos.x - this.prevPos.x);
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
                enemies.forEach(enememytje => {
                    enememytje.selected = false;
                    enememytje.stroke = color(0);
                    enememytje.shootSpeed = 300;
                    });
                this.selected = true;
                this.stroke = new Color(255, 0, 255);
                this.collider = 'd';
            }
        }

        rotateBlock(){
            if(this.canRotate == true){
                this.rotate(1, 1);
            }
        }

        
        // moveBetweenPoints(x1, x2, y1, y2){
        //     if(this.pos.x == x1 && this.pos.y == y1){ 
        //         this.moveTo(x2, y2, 0.03);
        //     }
        //     if(this.pos.x == x2 && this.pos.y == y2){ 
        //         this.moveTo(x1, y1, 0.03);
        //     }
        // }
    }
}