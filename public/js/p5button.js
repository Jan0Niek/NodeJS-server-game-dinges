function declareButton(){
    return class Button extends Sprite{
        constructor(x, y, w, h, func){
            super(x, y, w, h);
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
            this.callbackFunction = func;
        }
        checkPressed(){
            if(this.mouse.presses()){
                this.callbackFunction();
            }
        }
    }
}