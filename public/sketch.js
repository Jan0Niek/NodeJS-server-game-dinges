let chosenUsername = window.sessionStorage.getItem("username");

function setup() {
  createCanvas(1280, 720);
  textStyle(BOLD);
  strokeWeight(1);
  
}

function draw() {
  background(255);
  text(chosenUsername, mouseX, mouseY)
  
}
