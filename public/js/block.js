function declareBlock(){
return class Block extends Sprite(){
        constructor(x, y, width, height, maxSpeed){
            super(x, y, width, height, 'k');
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.maxSpeed = maxSpeed;
        }

        control() {
            if (kb.pressing('arrowUp')){
                this.move(this.maxSpeed, 'up', this.maxSpeed);
            } else if (kb.pressing('arrowLeft')) {
                this.move(this.maxSpeed, 'left', this.maxSpeed);
            } else if (kb.pressing('arrowRight')) {
                this.move(this.maxSpeed, 'right', this.maxSpeed);
            } else if (kb.pressing('arrowDown')) {
                this.move(this.maxSpeed, 'down', this.maxSpeed);
            }
        }
    }
}