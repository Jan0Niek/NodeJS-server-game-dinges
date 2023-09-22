class Player{
    constructor(x, y, accel){
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 120;
        this.accel = accel;
        this.velX=0.1;
        this.velY=0.1;
        this.jumped = false;
    }
    platformGravityJumpHeightSideMovementSpeedFriction(
        gravity,
        jumpHeight,
        sideMovement,
        friction,
        blocks
      ) {
        this.velY += Number(gravity);
        this.y += Number(this.velY);
        //loop door alle blocks zodat je er niet doorheen valt 
        blocks.forEach(block => {
          if (this.x + this.width >= block.x && this.x <= block.x + block.width && this.y + this.height >= block.y && this.y <= block.y + block.height) {
            while ((this.x + this.width >= block.x && this.x <= block.x + block.width && this.y + this.height >= block.y && this.y <= block.y + block.height)) {
              this.y +=(Math.abs(Number(this.velY)) /Number(this.velY)) *-1;
            }
            this.velY=0;
            //hoger als je ingedrukt houdt, al tap/tik je ga ja laag
            if (keyIsDown(32) || keyIsDown(87)){
              this.jumped = true;
              this.airFrames = 0;
            }
          }
          if (this.jumped && this.airFrames < 6){
            if (keyIsDown(32) || keyIsDown(87)){
              this.velY -= jumpHeight;
              this.airFrames++;
            }else{
              this.jumped = false;
            }
          }
        });
        this.velX =
          (Number(this.velX) +
            (Number(keyIsDown(65)) *
              (Number(sideMovement) * -1) +
              Number(keyIsDown(68)) *
                Number(sideMovement))) *
          Number(friction);
        this.x += this.velX;
        blocks.forEach(block => {
          if (this.x + this.width >= block.x && this.x <= block.x + block.width && this.y + this.height >= block.y && this.y <= block.y + block.height) {
            while ((this.x + this.width >= block.x && this.x <= block.x + block.width && this.y + this.height >= block.y && this.y <= block.y + block.height)) {
              this.x +=(Math.abs(Number(this.velX)) /Number(this.velX)) *-1;
            }
            this.velX=0;
          }
        });
      }
    draw(){
        fill(30, 120, 180);
        rect(this.x, this.y, this.width, this.height);
    }
}