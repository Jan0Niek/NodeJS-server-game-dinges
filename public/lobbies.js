let socket = io({transports: ['websocket'], upgrade: false});

socket.on("uuid", (uuid) => {
    window.sessionStorage.setItem("uuid", uuid);
});

socket.on("room", (roomName, players) => {
    //voeg een div toe met roomname en join knop, on:hover moet het de daarinzittende players laten zien   !! !! !! !!
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