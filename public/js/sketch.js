new Q5();


let chosenUsername = window.sessionStorage.getItem("username");
// function setUsername(name){
//   chosenUsername = name;
// }

let otherPlayers = {};

function addOtherPlayer(id, username){
  otherPlayers[id] = new OtherPlayer(id, username);
}

//declarations of custom classes:
const Button = declareButton();

new Canvas(1280, 720);
textStyle(BOLD);
strokeWeight(1);

const testFunc = () => {
  console.log("JAAAAA")
}
  
let button1 = new Button(60, 80, 120, 40, testFunc)

function draw() {
  background(255);
  button1.checkPressed()
  
  
}

