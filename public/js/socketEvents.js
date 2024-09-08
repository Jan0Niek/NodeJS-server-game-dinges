//socket defined in lobbies.js

socket.on("playerNum", (playerNum) =>{
    setPlayerNum(playerNum);
});

socket.on("notPlayerX", () => {
    console.log("kies een andere player om te zijn, dit kan niet!!!")
});

socket.on("otherPlayer", (id, username) => {
    console.log("iemand is er")
    addOtherPlayer(id, username);
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