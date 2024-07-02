function declareEnemy(){
    return class Enemy extends Sprite{
        constructor(x, y, width, canMove){  
            super(x, y, width, 'triangle', 'd')
            this.x = x;
            this.y = y;
            this.color = new color(145, 1, 8);
            this.stroke = new color(255, 46, 56);
            this.strokeWeight = 3;
            this.canMove = true;
            this.canShoot = false;
            this.canJump = true;
            this.timer = 0;
            this.timerJump = 0;
            this.movementSpeed = 5;
            this.rotationLock = true;

            this.hitbox = new Sprite(this.x, this.y+this.width*0.2, this.width*1.1, this.width*0.1, 'n');
            this.hitbox.visible = true;
            new GlueJoint(this, this.hitbox).visible = false;
            this.hitbox.overlapping(allSprites, this.somethingIsOnTop);

            this.colliding(allSprites, this.dead);
            

        }

        moveBetweenPoints(){   
            this.applyForceScaled(this.movementSpeed*1.4, 0);
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

        jump(){
            if(this.canJump == true){
                this.timerJump ++;
                if(this.timerJump > random(250, 400)){
                    this.vel.y -= 8; 
                    this.timerJump = 0;
                }
            }
        }

        dead(enememytje, sprite2){
            if(sprite2 == playertje){
                console.log('rip');
                buildLevel(welkLevel);
            }
        }
    }
}
