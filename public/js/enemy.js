function declareEnemy(){
    return class Enemy extends Sprite{
        constructor(x, y ,width, height){  
            super(x, y, height, width, 'k')
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
    }
}