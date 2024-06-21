function declareBullet(){
    return class Bullet extends Sprite{
        constructor(x, y){  
            super(x, y, 30, 'triangle', 'd')
            this.gravityScale = 0;
            this.x = x;
            this.y = y;
            this.color = new color(145, 1, 8);
            this.stroke = new color(255, 46, 56);
            this.strokeWeight = 3;
            this.colliding(allSprites, this.contactWithSomething)
        }

        contactWithSomething(bullet, sprite2){
            if(sprite2 != playertje && sprite2 != enememytje){
                this.remove()
            }
        }
    }

}