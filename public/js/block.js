function declareBlock(){
    return class Block extends Sprite{
        constructor(x, y, width, height, maxSpeed){
            super(x, y, width, height, 'k');
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.maxSpeed = maxSpeed;
            // this.colliding(allSprites, this.collision);


            this.topSensor = new Sprite(this.x, this.y-30, this.width, 18, 'n');
            this.topSensor.visible = true;
            new GlueJoint(this, this.topSensor).visible = false;
            this.topSensor.overlapping(allSprites, this.somethingIsOnTop)

            this.gravityScale = 0;
            this.mass=10;
            this.tile = 'b';
            this.rotationLock = true;
            this.selected = false;
            this.stroke = color(0);
            this.strokeWeight = 2;
            
        }

        control() {
            this.vel.set(0, 0);
            
            if (kb.pressing('arrowUp') && this.selected == true)     this.vel.y -= 1;
            if (kb.pressing('arrowLeft') && this.selected == true)   this.vel.x -= 1;
            if (kb.pressing('arrowRight') && this.selected == true)  this.vel.x += 1;
            if (kb.pressing('arrowDown') && this.selected == true)   this.vel.y += 1;
            this.vel.normalize();
            this.vel.set(this.vel.x*this.maxSpeed, this.vel.y*this.maxSpeed)

            
        }

        somethingIsOnTop(block, sprite2){
            	if(sprite2.name=='player'){
                    sprite2.vel.x += this.vel.x
                    console.log('asdasd')
                }
                console.log(sprite2.name)
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