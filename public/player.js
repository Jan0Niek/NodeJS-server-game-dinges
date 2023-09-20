class Player{
    constructor(x, y, accel){
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 120;
        this.accel = accel;
        this.velX=0;
        this.velY=0;
    }
    move(key, gravity){
        //wasd
        if (keyIsDown(65)){
            // this.velX -= this.accel
            this.x--;
        }
        if (keyIsDown(68)){
            // this.velX += this.accel;
            this.x++;
        }
        //jump etc moet nog

        //gravity
        this.velY = gravity;

        this.x += this.velX;
        this.y += this.velY;
        
    }
    //wordt in de main loop ge- for-looped door de lijst van alle blokken
    collision(block){
        let testX = this.x + this.velX;
        let testY = this.y;
        if (this.x + this.width >= block.x && this.x <= block.x + block.width && this.y + this.height >= block.y && this.y <= block.y + block.height) {    
            this.x -= this.velX;
            this.velX=0;
        }
        testX = this.x;
        testY = this.y + this.velY;
        if (this.x + this.width >= block.x && this.x <= block.x + block.width && this.y + this.height >= block.y && this.y <= block.y + block.height) {  
            this.y -= this.velY;
            this.velY=0;
        }
    }
    draw(){
        fill(30, 120, 180);
        rect(this.x, this.y, this.width, this.height);
    }
}