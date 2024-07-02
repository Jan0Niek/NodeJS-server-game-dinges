new Q5();
doNotDisplay(document.getElementById("q5Canvas0"));

let chosenUsername = window.sessionStorage.getItem("username");
function setUsername(name){
  chosenUsername = name;
}
let myPlayerNum = -1;
function setPlayerNum(num){
  myPlayerNum = num;
  console.log('ik ben p'+myPlayerNum)
}

let otherPlayers = new Set();

function addOtherPlayer(id, username){
  // otherPlayers.add(new OtherPlayer(id, username));
  otherPlayers.add(username);
  console.log(username + "  toegevoegd")
}
const requestToBePlayerX = (playerNum) => {
  console.log('knop nr ' + playerNum + ' gedrukt')
  socket.emit("requestToBePlayerX", (playerNum))
}



//declarations of custom classes:
const Button = declareButton();


new Canvas(1280, 720); //add pixel density factor multiplier to all variables? geen haast daarmee
textStyle(BOLD);
strokeWeight(1);


let button1 = new Button(200, 400, 300, 400, color(200, 80, 160), 'Klik mij voor p1', 20, requestToBePlayerX, (1));
let button2 = new Button(600, 400, 300, 400, color(200, 80, 160), 'Klik mij voor p2', 20, requestToBePlayerX, (2));



function draw() {
  background(255);
  text("my name is: " + chosenUsername, canvas.hw, 40);
  text("i'm player " + myPlayerNum, canvas.hw, 50);
  text("OTHER players in lobby: ", 40, 10);
  let i = 0;
  for (const name of otherPlayers) {
    text(name, 40, 20+i*10)
    i++;
  }

  button1.checkPressed();
  button2.checkPressed();
  
  
}

