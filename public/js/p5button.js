function declareButton(){
    return class Button extends Sprite{
        constructor(x, y, w, h, col1, text, textSize, func=null, args=null, toggle=false, col2=null, text2=null){
            super(x, y, w, h, 'k');
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
            this.constWidth = w;
            this.constHeight = h;
            this.callbackFunction = func;
            this.callbackFunctionArguments = args;
            this.color = col1;
            this.origColor = col1;
            this.col2 = col2;
            this.text = text;
            this.textSize = textSize;
            this.toggle = toggle;
            this.toggled = false;
            this.origText = text;
            this.text2 = text2;
        }
        checkPressed(){
            if(this.mouse.presses()){
                this.callbackFunction(this.callbackFunctionArguments);
                if(this.toggle) {
                    this.toggled = !this.toggled;
                    if(this.toggled){
                        this.color = this.col2;
                        this.text = this.text2;
                    }else{
                        this.color = this.origColor;
                        this.text = this.origText;
                    }
                }
                
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