"use strict";
function declarePlayer() {
    return class Player extends Sprite {
        constructor(x, y, width, height) {
            super(x, y, width, height);
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            // this.draw();
        }
    };
}
