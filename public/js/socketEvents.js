//socket defined in lobbies.js

socket.on("playerNum", (playerNum) =>{
    setPlayerNum(playerNum);
});

socket.on("notPlayerX", () => {
    console.log("kies een andere player om te zijn, dit kan niet!!!")
    window.alert("Someone else is already that player");
});

socket.on("otherPlayer", data => {
    console.log("iemand is er")
    addOtherPlayer(data);
});

socket.on("otherPlayerNum", (id, playerNum) => {
    setOtherPlayer(id, playerNum);
})

socket.on("otherPlayerReady", (id, ready) => {
    setOtherPlayer(id, null, ready);
});

socket.on("otherPlayerDisconnect", (id) => {
    console.log(otherPlayers.get(id).username + " has left.")
    otherPlayers.delete(id);
});



socket.on("startGame", () => {
    scenes.gaming();
});

