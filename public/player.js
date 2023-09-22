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
    // move(key, gravity){
    //     //wasd
    //     if (keyIsDown(65)){
    //         // this.velX -= this.accel
    //         this.x -= this.accel;
    //     }
    //     if (keyIsDown(68)){
    //         // this.velX += this.accel;
    //         this.x += this.accel;
    //     }
    //     //jump etc moet nog

    //     //gravity
    //     // this.velY += gravity;

    //     // this.x += this.velX;
    //     this.y += gravity;
    //     // this.velX /= 2;
        
    // }
    // //wordt in de main loop ge- for-looped door de lijst van alle blokken
    // collision(block){
    //     let testX = this.x;
    //     let testY = this.y + gravity;
    //     if (this.x + this.width >= block.x && this.x <= block.x + block.width && this.y + this.height >= block.y && this.y <= block.y + block.height) {  
    //         this.y -= gravity-gravity;
    //     }
    //     testX = this.x + this.accel;
    //     testY = this.y;
    //     if (this.x + this.width >= block.x && this.x <= block.x + block.width && this.y + this.height >= block.y && this.y <= block.y + block.height) {    
    //         this.x -= this.accel;
    //     }
    //     testX = this.x - this.accel;
    //     testY = this.y;
    //     if (this.x + this.width >= block.x && this.x <= block.x + block.width && this.y + this.height >= block.y && this.y <= block.y + block.height) {    
    //         this.x += this.accel;
    //     }
    //     //zorg dat hij geen snelheid opbouwt als hij op een blok staat CHECK
        
    // }
    platformGravityJumpHeightSideMovementSpeedFriction(
        gravity,
        jumpHeight,
        sideMovement,
        friction,
        blocks
      ) {
        this.velY += Number(gravity);
        this.y += Number(this.velY);
        blocks.forEach(block => {
          if (this.x + this.width >= block.x && this.x <= block.x + block.width && this.y + this.height >= block.y && this.y <= block.y + block.height) {
            while ((this.x + this.width >= block.x && this.x <= block.x + block.width && this.y + this.height >= block.y && this.y <= block.y + block.height)) {
              this.y +=(Math.abs(Number(this.velY)) /Number(this.velY)) *-1;
            }
            this.velY=0;
            
            if (keyIsDown(32) || keyIsDown(87)){
              this.velY = -jumpHeight;
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