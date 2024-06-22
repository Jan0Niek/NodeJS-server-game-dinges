function declareEnemy(){
    return class Enemy extends Sprite{
        constructor(x, y, canMove){  
            super(x, y, 50, 'triangle', 'd')
            this.x = x;
            this.y = y;
            this.color = new color(145, 1, 8);
            this.stroke = new color(255, 46, 56);
            this.strokeWeight = 3;
            this.canMove = true;
            this.canShoot = false;
            this.timer = 0;
            this.movementSpeed = 5;
            this.rotationLock = true;

            this.hitbox = new Sprite(this.x, this.y, this.width+20, this.width-30, 'n');
            this.hitbox.visible = false;
            new GlueJoint(this, this.hitbox).visible = false;
            this.hitbox.overlapping(allSprites, this.somethingIsOnTop)

        }

        moveBetweenPoints(){   
            this.applyForce(this.movementSpeed*2.11, 0);
            if(this.canMove == true){
                if(this.hitbox.overlaps(allSprites)){
                    this.movementSpeed = -this.movementSpeed;
                }


            }
        }
    
        shootAtplayer(){
            if(this.canShoot == true){
                this.timer ++;
                if(this.timer > 300){                
                    let bullet = new Bullet(this.x , this.y - 20 );
                    bullet.moveTowards(playertje.x, playertje.y, 0.03);
                    this.timer = 0;
                }
            }
        }
    }
}
