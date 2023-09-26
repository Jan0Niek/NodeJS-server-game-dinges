let socket;

function setup() {
  createCanvas(400, 400);
  socket = io();  //dit fixt het met dat alleen localhost werkt, nu kan ook 127.0.0.1
  
  socket.on('typed', data => {
    text(data.key, data.x, data.y);
  });
}

function draw() {
<<<<<<< Updated upstream
  line(10, 20, 180, 160);
=======
  background(255);
  text(frameRate(), 20, 20);
  blocks.forEach(block => {
    velX = block.move(2);
    block.draw();
  });
  //movement done
  player.platformGravityJumpHeightSideMovementSpeedFriction(0.9, 24, 2, 0.8, blocks, velX);
  player.draw();

  fill(186, 41, 11)
  ellipse(200, 260 , 170, 140);
  fill(186, 41, 11)
  ellipse(200, 200, 85, 110)
  fill(15, 35, 135)
  ellipse(250, 340, 40, 80)
  fill(15, 35, 135)
  ellipse(150, 340, 40, 80)
  fill(255,255,255)
  rect(172, 205, 60, 20, 20)
  rect(205, 180, 20, 20, 10)
  rect(175, 180, 20, 20, 10)

  fill(186, 41, 11)
>>>>>>> Stashed changes
  
  // color()
}


function keyPressed(){
  const data = {
    x: mouseX, 
    y: mouseY,
    key: key
  }
  socket.emit('typed', data);
  text(data.key, data.x, data.y);
}