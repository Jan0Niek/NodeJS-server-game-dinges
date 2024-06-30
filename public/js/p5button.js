function declareButton(){
    return class Button extends Sprite{
        constructor(x, y, w, h, col, text, textSize, func){
            super(x, y, w, h);
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
            this.constWidth = w;
            this.constHeight = h;
            this.callbackFunction = func;
            this.color = col;
            this.text = text;
            this.textSize = textSize;
        }
        checkPressed(){
            if(this.mouse.presses()){
                this.callbackFunction();   
            }

            if(this.mouse.pressing()){
                this.strokeWeight = 3;
                this.width = this.constWidth * 0.95;
                this.height = this.constHeight * 0.95;
            }else{
                this.strokeWeight = 1;
                this.width = this.constWidth;
                this.height = this.constHeight;
            }
        }
    }
}