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
        this.currentLevel = { }
        this.levelNum = 0;
    }
    setLevel(welke, allLevels){
        this.levelNum = welke;
        this.currentLevel = allLevels[this.levelNum]
    }

}

module.exports = RoomData;