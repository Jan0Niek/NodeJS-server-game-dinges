class Button{
    constructor(x, y, width, height, text, textCol, col1, col2){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.color = col1;
        this.color2 = col2;
        this.textColor = textCol;
    }

    onClick(mouseX, mouseY){
        
    }

    draw(mouseX, mouseY){
        fill(this.color);
        rect(this.x, this.y, this.width, this.height, 4, 4, 4, 4);
        fill(this.textColor);
        text(this.text, this.x+this.width/2, this.y+this.height/2);
        if (mouseX < this.x + this.width && mouseX > this.x && mouseY < this.y + this.height && mouseY > this.y) {
            fill(this.color);
            rect(this.x, this.y, this.width, this.height, 4, 4, 4, 4);
            fill(this.color);
            text(this.text, this.x+this.width/2, this.y+this.height/2);
        }

    }
}