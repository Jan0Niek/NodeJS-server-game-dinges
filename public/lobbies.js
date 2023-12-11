let socket = io({transports: ['websocket'], upgrade: false});

socket.on("uuid", (uuid) => {
    window.sessionStorage.setItem("uuid", uuid);
});

socket.on("room", (roomName, players) => {
    //voeg een div toe met roomname en join knop, on:hover moet het de daarinzittende players laten zien   !! !! !! !!
    let lobbylist = document.getElementById("lobbies");
    lobbylist.style.display = "block";
    
    let lobby = document.createElement("div");
    lobby.classList.add("lobby");
    lobby.innerHTML = roomName;
    let joinBtn = document.createElement("button");
    joinBtn.classList.add("lobbyButton");
    joinBtn.innerHTML = "Join!";


    lobby.append(joinBtn);
    lobbylist.appendChild(lobby);

});

function displayNone(element){
    element.style.display = "none";
}
function displayBlock(element){
    element.style.display = "block";
}

document.getElementById("createRoom").addEventListener("click", () => {
    let lobbylist = document.getElementById("lobbies");
    lobbylist.style.display = "block";

    let lobby = document.createElement("div");
    lobby.classList.add("lobby");
    lobby.innerHTML = "lobbyName";

    let buttons = document.createElement("div");
    buttons.classList.add("lobbyButtons")

    let joinBtn = document.createElement("button");
    joinBtn.classList.add("lobbyButton");
    joinBtn.innerHTML = "Join!";


    let playerList = document.createElement("ul");
    for (let i = 0; i < 3; i++) {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode("playerName"));
        playerList.appendChild(li);  
    }
    playerList.style.display = "none";

    let playersBtn = document.createElement("button");
    playersBtn.classList.add("lobbyButton");
    playersBtn.innerHTML = "Show/hide players in this lobby";
    playersBtn.addEventListener("click", () => {
        if (playerList.style.display === "none"){
            displayBlock(playerList);
        } else {
            displayNone(playerList);
        }
    });

    //de volgorde hiervan NIET aanpassen ajb
    buttons.append(joinBtn);
    buttons.append(playersBtn);
    lobby.append(buttons)
    lobby.append(playerList)
    lobbylist.appendChild(lobby);
});


function makeRed(elementId){
    console.log(elementId)
    document.getElementById(elementId).classList.add("red");
}
function makeNotRed(elementId){
    document.getElementById(elementId).classList.remove("red");
}

function flickerElementRedById(elementId, flickerTime, stopTime){
    let intevalVar = setInterval(() => {
        setTimeout(function () {
            makeRed(elementId);
        }, flickerTime/2); 
        setTimeout(function () {
            makeNotRed(elementId);
        }, flickerTime); 
    }, flickerTime);
    setTimeout(() => {
        clearInterval(intevalVar);
    }, stopTime); 
}

document.getElementById("nameConfirm").addEventListener("click", function(){
    document.getElementById("username").style.color = "black";
    let username = document.getElementById("username").value;

    if (username.length == 0) { flickerElementRedById("username", 400, 3200); return; }

    window.sessionStorage.setItem("username", username);
    socket.emit("username", username);
});

document.getElementById("createRoom").addEventListener("click", function(){
    let roomName = document.getElementById("roomName").value;
    let haveToBreak = false;
    
    if (document.getElementById("username").value.length === 0){
        flickerElementRedById("username", 400, 3200);
        haveToBreak = true;
    } if (roomName.length === 0){
        flickerElementRedById("roomName", 400, 3200);
        haveToBreak = true;
    } if (haveToBreak) {
        return;
    }

    socket.emit("newRoom", roomName); //zoiets ofzo? idk
});