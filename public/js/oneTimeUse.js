function declareOneTimeUse(){
    return class OneTimeUse extends Sprite{
        constructor(x, y, width, height){
            super(x, y, width, height, 'k');
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.colliding(allSprites, this.isColliding)
            this.timer = 0;
        }

        isColliding(oneTimeUse, sprite2){
            this.timer ++;
            if(this.timer > 120 && sprite2 == playertje){
                this.remove()
                this.timer = 0;
            }

        }
    }
}