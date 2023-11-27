let socket = io({transports: ['websocket'], upgrade: false});

socket.on("uuid", (uuid) => {
    window.sessionStorage.setItem("uuid", uuid);
});

socket.on("rooms", (rooms) => {
    //ja en doe de rooms dan in de html-pagina
});

function makeRed(elementId){
    console.log(elementId)
    document.getElementById(elementId).classList.add("red");
}
function makeNotRed(elementId){
    document.getElementById(elementId).classList.remove("red");
}

function flickerElementRed(elementId, flickerTime, stopTime){
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

    if (username.length == 0) { flickerElementRed("username", 400, 3200); return; }

    window.sessionStorage.setItem("username", username);
    socket.emit("join", username);
});

document.getElementById("createRoom").addEventListener("click", function(){
    if (document.getElementById("username").value.length === 0){
        flickerElementRed("username", 400, 3200);
        return;
    }
    
    let roomName = document.getElementById("roomName").value;
    
});