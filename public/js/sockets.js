let socket = io({transports: ['websocket'], upgrade: false});

function displayNone(element){
    element.style.display = "none";
}
function displayBlock(element){
    element.style.display = "block";
}

socket.on("room", (lobbyName, players) => {
    //voeg een div toe met roomname en join knop
    console.log("room dinges")

    let lobbylist = document.getElementById("lobbies");
    lobbylist.style.display = "block";

    let lobby = document.createElement("div");
    lobby.classList.add("lobby");
    lobby.innerHTML = lobbyName;

    let buttons = document.createElement("div");
    buttons.classList.add("lobbyButtons")

    let joinBtn = document.createElement("button");
    joinBtn.classList.add("lobbyButton");
    joinBtn.innerHTML = "Join!";
    joinBtn.addEventListener("click", () => { 
        // room joining!!! ofzo
        let username = document.getElementById("username").value;
        if (username.length == 0) { flickerElementRedById("username", 400, 3200); return; }
        window.sessionStorage.setItem("username", username);
        socket.emit("username", username);
        socket.emit("joinRoom", (lobbyName));
        displayNone(document.getElementById("wrapper"));
        displayBlock(document.getElementsByClassName("q5Canvas")[0]);
    })


    let playerList = document.createElement("ul");
    players.forEach(player => {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(player));
        playerList.appendChild(li);  
    });
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

document.getElementById("username").addEventListener("input", function(){
    document.getElementById("username").style.color = "black";
    let username = document.getElementById("username").value;

    window.sessionStorage.setItem("username", username);
    console.log("username was set to: " + username);

    socket.emit("username", username);
});

document.getElementById("refreshList").addEventListener("click", function(){
    let lobbies = document.getElementById("lobbies");
    lobbies.remove();
    let newLobbies = document.createElement("div");
    newLobbies.classList.add("roomsList");
    newLobbies.id = "lobbies";
    newLobbies.style.display = "block";
    document.getElementById("wrapper").append(newLobbies);

    socket.emit("getLobbies");
    let username = document.getElementById("username").value;
    socket.emit("username", username);
    window.sessionStorage.setItem("username", username);
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
    let username = document.getElementById("username").value;
    socket.emit("username", username);
    window.sessionStorage.setItem("username", username);

    socket.emit("newRoom", roomName); //zoiets ofzo? idk
    displayNone(document.getElementById("wrapper"));
    displayBlock(document.getElementsByClassName("q5Canvas")[0]);
});



function updatePosition(data){
    socket.emit("position", data);
}

socket.on("position", (data) => {
    updateOtherPlayerPosition(data);
});

socket.on("otherPlayer", (id, username) => {
    addOtherPlayer(id, username);
});