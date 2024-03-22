new Q5()
export default class Block extends Sprite(){
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
                blocks.move(blocks.maxSpeed, 'up', blocks.maxSpeed);
            } else if (kb.pressing('arrowLeft')) {
                blocks.move(blocks.maxSpeed, 'left', blocks.maxSpeed);
            } else if (kb.pressing('arrowRight')) {
                blocks.move(blocks.maxSpeed, 'right', blocks.maxSpeed);
            } else if (kb.pressing('arrowDown')) {
                blocks.move(blocks.maxSpeed, 'down', blocks.maxSpeed);
            }
        }
    }