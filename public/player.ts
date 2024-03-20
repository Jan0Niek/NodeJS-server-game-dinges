class Player extends Sprite{
    constructor(x:number, y:number, width:number, height:number){
        super(x, y, width, height)
        this.x = x;
        this.y = y;
        this.width = width
        this.height = height;
        // this.draw();
        
    }
}
function declarePlayer() : typeof Player{
    return class Player extends Sprite{
        constructor(x:number, y:number, width:number, height:number){
            super(x, y, width, height)
            this.x = x;
            this.y = y;
            this.width = width
            this.height = height;
            // this.draw();
            
        }
    }
}