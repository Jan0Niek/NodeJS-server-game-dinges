class Player{
    constructor(x, y, accel){
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 120;
        this.accel = accel;
        this.velX=0.1;
        this.velY=0.1;
    }
    platformGravityJumpHeightSideMovementSpeedFriction(
        gravity,
        jumpHeight,
        sideMovement,
        friction,
        blocks, 
        velXb
      ) {
        blocks.forEach(block => {
          if (this.x + this.width >= block.x && this.x <= block.x + block.width && this.y + this.height >= block.y && this.y <= block.y + block.height) {
            
          }
        });
        this.velY += Number(gravity) * deltaTime / 13;
        //delen door dertien zodat je niet insane snel gaat, ineffiecient, maar effectief
        this.y += Number(this.velY) * deltaTime / 13;
        //loop door alle blocks zodat je er niet doorheen valt 
        blocks.forEach(block => {
          if (this.x + this.width >= block.x && this.x <= block.x + block.width && this.y + this.height >= block.y && this.y <= block.y + block.height) {
            while ((this.x + this.width >= block.x && this.x <= block.x + block.width && this.y + this.height >= block.y && this.y <= block.y + block.height)) {
              this.y +=(Math.abs(Number(this.velY)) /Number(this.velY)) *-1;
            }
              console.log(velXb);
              this.x += velXb * deltaTime / 13;
            this.velY=0;
            //moet nog fixen dat je meer spring als je langer ingedrukt houdt
            //nee laat maar fuck dat ik ben te lui
            if (keyIsDown(32) || keyIsDown(87)){
              this.velY = -jumpHeight;
            }
          }
        });
        this.velX =(Number(this.velX) +(Number(keyIsDown(65)) *(Number(sideMovement) * -1) +Number(keyIsDown(68)) *Number(sideMovement))) *Number(friction);
        this.x += this.velX * deltaTime / 13;
        blocks.forEach(block => {
          if (this.x + this.width >= block.x && this.x <= block.x + block.width && this.y + this.height >= block.y && this.y <= block.y + block.height) {
            while ((this.x + this.width >= block.x && this.x <= block.x + block.width && this.y + this.height >= block.y && this.y <= block.y + block.height)) {
              this.x +=(Math.abs(Number(this.velX)) /Number(this.velX)) *-1;
            }
          }
        });
      }
    draw(){
        fill(30, 120, 180);
        rect(this.x, this.y, this.width, this.height);
    }
}