function loadLevel(levelNum) {
    switch (levelNum) {
        case 1:
            return{
                blocks: [
                    // new Block(200, 300, 100, 40),
                    // new Block(500, 300, 100, 40),
                    new Block(800, 500, 100, 40)
                ],
                enemies: [
                    new Enemy(60, 500, 80, true),
                    new Enemy(200, 500, 80, true)
                ],
                normalSprites: [
                    new Sprite (width/2, height-18, 1000000, 20, 'k')
                ],
                player: new Player(100, 160, 30, 100),
                finish:  new Finish(400, 400, 100, 40)

            };

            break;

        case 2:
            return{
                blocks: [
                    new Block(200, 300, 100, 40),
                    new Block(500, 300, 100, 40),
                    new Block(800, 500, 100, 40)
                ],
                enemies: [
                    new Enemy(60, 500, 80, true),
                    new Enemy(200, 500, 80, true)
                ],
                normalSprites: [
                    new Sprite (width/2, height-18, 1000000, 20, 'k')
                ],
                player: new Player(100, 160, 300, 100),
                finish:  new Finish(400, 400, 100, 40)

            };

            break;
    
        default:
            //homescreen ofzo;
            break;
    }
}
    
