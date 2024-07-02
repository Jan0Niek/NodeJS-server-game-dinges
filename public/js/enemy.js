function declareEnemy(){
    return class Enemy extends Sprite{
        constructor(x, y, width, canMove, canJump, canShoot){  
            super(x, y, width, 'triangle', 'd')
            this.x = x;
            this.y = y;
            this.maxSpeed = 3;
            this.color = new color(145, 1, 8);
            this.stroke = new color(255, 46, 56);
            this.strokeWeight = 3;
            this.canMove = false;
            this.canShoot = true;
            this.canJump = false;
            this.timer = 0;
            this.timerJump = 0;
            this.movementSpeed = 5;
            this.rotationLock = true;
            this.selected = false;
            

            this.walkSpeed = 7.5;
            this.runSpeed = 9; //no
            this.jumpStrength = 6;
            this.rotationLock = true;
            this.bounciness = 0;
            this.friction = 0.0;

            this.airborne = false;
            this.grounded = false;

            this.shootSpeed = 300; 

            this.hitbox = new Sprite(this.x, this.y+this.width*0.2, this.width*1.1, this.width*0.1, 'n');
            this.hitbox.visible = true;
            new GlueJoint(this, this.hitbox).visible = false;
            this.hitbox.overlapping(allSprites, this.somethingIsOnTop);

            this.colliding(allSprites, this.dead);
            

        }

        moveBetweenPoints(){   
            if(this.canMove == true){
                this.applyForceScaled(this.movementSpeed*1.4, 0);
                if(this.hitbox.overlaps(allSprites)){
                    this.movementSpeed = -this.movementSpeed;
                }


            }
        }

        
        control() {
            if(this.selected == true){
                this.gravityScale = 1;
            if (kb.pressing('arrowUp')){
                console.log('sprongetje')
                if(this.colliding(allSprites)){
                    this.vel.y = -8;
                    this.grounded = false;
                }
                this.gravityScale -= 0.4;
            }
            if (kb.pressing('arrowDown')){
                this.gravityScale += 1.0;
            }

            if(kb.pressing('arrowLeft') && this.vel.x > -this.walkSpeed){
                this.applyForceScaled(-this.walkSpeed*2, 0);
            }
            if(kb.pressing('arrowRight') && this.vel.x < this.walkSpeed){
                this.applyForceScaled(this.walkSpeed*2, 0);
            }

            this.vel.x *= 0.98;
            }
            
        }

        toggleSelection(enemies){
            if(this.mouse.presses()){
                enemies.forEach(enememytje => {
                    enememytje.selected = false;
                    enememytje.stroke = color(0);
                    enememytje.shootSpeed = 300;
                });
                this.selected = true;
                this.stroke = new Color(255, 0, 255);
                this.shootSpeed = 50;
            }
        }
    
        shootAtplayer(){
            if(!this.selected){
                if(this.canShoot == true){
                    this.timer ++;
                    if(this.timer > this.shootSpeed){                
                        let bullet = new Bullet(this.x , this.y - 20 );
                        console.log('geschoten');
                        bullet.moveTowards(playertje.x, playertje.y, 0.03);
                        this.timer = 0;
                    }
                }
            }else{
                if(this.canShoot == true){
                    this.timer ++;
                    if(this.timer > this.shootSpeed && mouse.presses('right')){                
                        let bullet = new Bullet(this.x , this.y - 20 );
                        console.log('geschoten');
                        bullet.moveTowards(mouse.x, mouse.y, 0.03);
                        this.timer = 0;
                    }
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
