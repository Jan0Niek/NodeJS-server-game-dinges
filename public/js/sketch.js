new Q5();
doNotDisplay(document.getElementById("q5Canvas0"));
const emojiFont = loadFont("assets/NotoColorEmoji-Regular.ttf");
const suseFont = loadFont("assets/SUSE-VariableFont_wght.ttf")
textFont(suseFont)

let chosenUsername;
function setUsername(name){
  chosenUsername = name;
}

let activeScene = scenes.menu; 

let myPlayerNum = -1;
function setPlayerNum(num){
  myPlayerNum = num;
  // console.log('ik ben p'+myPlayerNum)
}

/** @type {Map<String, OtherPlayer>} */
var otherPlayers = new Map();

function addOtherPlayer(data){
  otherPlayers.set(data.id, new OtherPlayer(data.id, data.username));

  if(data.playerNum != null) otherPlayers.get(data.id).playerNum = data.playerNum;
  if(data.readiness != null) otherPlayers.get(data.id).ready = data.readiness;
}
function setOtherPlayer(id, playerNum=null, readiness=null){
  //🤮
  // if(username != null)  otherPlayers.get(id).username = username;
  // console.log(username + " lol wat is dit")
  if(playerNum != null) otherPlayers.get(id).playerNum = playerNum;
  if(readiness != null) otherPlayers.get(id).ready = readiness;
}


//declarations of custom classes:
const Button = declareButton();

new Canvas(1280, 720); //add pixel density factor multiplier to all variables? geen haast daarmee
textStyle(BOLD);
strokeWeight(1);


function draw() {
  activeScene();
}

