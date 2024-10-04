class OneTimeUse extends Sprite{
    constructor(x, y, width, height){
        super(x, y, width, height, 'k');
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.collided(allSprites, this.isColliding)
    }

    isColliding(oneTimeUse, sprite2){
        if(sprite2 == playertje){
            setTimeout(() =>{
                this.remove()
            }, 430)
        }
    }
}

module.exports = OneTimeUse;