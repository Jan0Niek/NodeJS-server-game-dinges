class Block{
    constructor(x, y, width, height, col){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.col = col;
        this.velX = 0;
        this.velY = 0;
        this.chosen = false;
    }
    move(sideMovement){
        this.velX = 0;
        this.velY = 0;
        this.velX =(Number(this.velX) + (Number(keyIsDown(37)) * (Number(sideMovement) * -1) + Number(keyIsDown(39)) * Number(sideMovement)));
        this.velY =(Number(this.velY) + (Number(keyIsDown(38)) * (Number(sideMovement) * -1) + Number(keyIsDown(40)) * Number(sideMovement)));
        this.x += this.velX * deltaTime / 13;
        this.y += this.velY * deltaTime / 13;
        return this.velX;
    }
    draw(){
        fill(this.col);
        rect(this.x, this.y, this.width, this.height);
    }
}