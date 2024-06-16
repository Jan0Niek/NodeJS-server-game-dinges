function declareBlock(){
    return class Block extends Sprite{
        constructor(x, y, width, height, maxSpeed){
            super(x, y, width, height, 'k');
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.maxSpeed = maxSpeed;
            this.colliding(allSprites, this.collision)
            this.handleClick(allSprites)
            this.isSelected = false; // Flag to track if the block is selected

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
        
        handleClick() {
            if(allSprites.mouse.pressed()){
                console.log("hihihihi")
                allSprites.isSelected = !this.isSelected;
                // Change block color or perform any action here
                allSprites.color = color(random(255), random(255), random(255)); // Change color randomly
            }




        }

        // collision(sprite1, sprite2) {
        //     if (sprite2 !== this && sprite2 != undefined) { // Assuming 'block' is the current instance
        //         // Example of handling collisions
        //         if (sprite2.collider == "d" || sprite2.collider == "dynamic") {
        //             console.log("Collision with KinematicSprite");
        //         }
        //     }
        // }

        if (mouseIsPressed) {
            block.handleClick();
        }
    }
}