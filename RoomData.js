class RoomData{
    constructor(){
        this.roomState=null;
        this.p5Lobby=null;
        this.p1 = {
            name : null, 
            pressedKeys : []
            
        }
        this.p2 = {
            name : null, 
            pressedKeys : []
            
        }
        this.currentLevel = {
            sprites : []
        }
    }

}

module.exports = RoomData;