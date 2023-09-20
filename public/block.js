class Block{
    constructor(x, y, width, height, col){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.col = col;
    }
    move(){
        //dit is voor de p2 code eventueel
    }
    draw(){
        fill(this.col);
        rect(this.x, this.y, this.width, this.height);
    }
}