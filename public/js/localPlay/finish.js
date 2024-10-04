function declareFinish(){
    return class Finish extends Sprite{
        constructor(x, y, width){
            super(x, y, width, 'pentagon', 'k');
            this.x = x;
            this.y = y;
            this.width = width;
        }
    }
}