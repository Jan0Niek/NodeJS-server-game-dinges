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
    mouseClickP2(x, y){
        
        this.p5Lobby.selectables.forEach(selectable => {
            if (!(x > selectable.x + selectable.w || selectable.x > x  || y  > selectable.y + selectable.h || selectable.y > y )){
                this.p5Lobby.selectables.forEach(selectable => {
                    selectable.selected = false
                })
                selectable.selected = true;
            }
        });
    }

}

module.exports = RoomData;