//socket defined in lobbies.js

socket.on("playerNum", (playerNum) =>{
    setPlayerNum(playerNum);
});

socket.on("notPlayerX", () => {
    console.log("kies een andere player om te zijn, dit kan niet!!!")
});

socket.on("otherPlayer", (id, username) => {
    addOtherPlayer(id, username);
});

socket.on("otherPlayerNum", (id, playerNum) => {
    addOtherPlayer(id, otherPlayers.get(id).username, playerNum)
})

