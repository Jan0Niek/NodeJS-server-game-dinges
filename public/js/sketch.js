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
/** @type {Map<String, OtherPlayer>} */
let otherPlayers = new Map();

function addOtherPlayer(id, username, playerNum=-1){
  otherPlayers.set(id, new OtherPlayer(id, username, playerNum));
  console.log(username + "  toegevoegd")
}


//declarations of custom classes:
const Button = declareButton();

new Canvas(1280, 720); //add pixel density factor multiplier to all variables? geen haast daarmee
textStyle(BOLD);
strokeWeight(1);


function draw() {
  activeScene();
}

