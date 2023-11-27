class Button{
    constructor(x, y, width, height, text, textColor, textSize, color1, color2){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.color = color1;
        this.color2 = color2;
        this.textColor = textColor;
        this.textSize = textSize;
    }

    onClick(mouseX, mouseY){
        //GODVERDOMME IK KOM ER NU ACHTER DAT JE NATUURLIJK IN HTML GEWOON AL EEN <button></button> hebt.... argh
        
    }

    draw(mouseX, mouseY){
        textSize(this.textSize);
        fill(this.color);
        rect(this.x, this.y, this.width, this.height, 4, 4, 4, 4);
        fill(this.textColor);
        // zo is de tekst ongeacht grootte gecentreerd
        // nederlands en engels door elkaar, een chaotische anarchie aan programmeerhel
        text(this.text, this.x + (this.width-textWidth(this.text))/2, this.y+this.height/2);
        if (mouseX < this.x + this.width && mouseX > this.x && mouseY < this.y + this.height && mouseY > this.y) {
            fill(this.color);
            rect(this.x, this.y, this.width, this.height, 4, 4, 4, 4);
            fill(this.color2);
            text(this.text, this.x + (this.width-textWidth(this.text))/2, this.y+this.height/2);
        }

    }
}