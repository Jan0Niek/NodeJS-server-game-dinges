new Q5();
doNotDisplay(document.getElementById("q5Canvas0"));

let chosenUsername;
function setUsername(name){
  chosenUsername = name;
}

let activeScene = scenes.menu; 

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
const tryStartGame = () =>{
  socket.emit("tryStartGame");
}

//declarations of custom classes:
const Button = declareButton();

new Canvas(1280, 720); //add pixel density factor multiplier to all variables? geen haast daarmee
textStyle(BOLD);
strokeWeight(1);


function draw() {
  activeScene();
}

