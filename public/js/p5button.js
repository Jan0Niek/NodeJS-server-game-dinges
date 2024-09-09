function declareButton(){
    return class Button extends Sprite{
        constructor(x, y, w, h, col1, text, textSize, func=null, args=null, toggle=false, col2=col1, text2=text, textCol1=color(0, 0, 0), textCol2=color(0, 0, 0)){
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
            this.origTextColor = textCol1;
            this.textColor = textCol1;
            this.textColor2 = textCol2;
        }
        checkPressed(){
            if(this.mouse.presses()){
                this.callbackFunction(this.callbackFunctionArguments);
                if(this.toggle) {
                    this.toggled = !this.toggled;
                    if(this.toggled){
                        this.color = this.col2;
                        this.text = this.text2;
                        this.textColor = this.textColor2;
                    }else{
                        this.color = this.origColor;
                        this.text = this.origText;
                        this.textColor = this.origTextColor;
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