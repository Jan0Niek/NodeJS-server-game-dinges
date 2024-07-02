function loadLevel(levelNum) {
    switch (levelNum) {
        case 1:
            return{
                blocks: [
                    // new Block(200, 300, 100, 40),
                    // new Block(500, 300, 100, 40),
                    new Block(800, 500, 100, 40),
                    new Block(-300, 500, 100, 40),
                    new Block(10, 650, 40, 100),
                    new Block(310, 650, 40, 100),
                    new Block(160, 590, 340, 40),
                    new Block(160, 670, 30, 30), 
                    new Block(-500, 600, 50, 50)

                ],
                enemies: [
                    new Enemy(160, 600, 40, false, false, true),
                    new Enemy(160, 590, 100, false, true, false)
                    // new Enemy(200, 500, 80, true)
                ],
                oneJumpBlocks: [
                    new oneTimeUse(200, 200, 100, 40)

                ],
                normalSprites: [
                    new Sprite (width/2, height-18, 1000000, 20, 'k'),
                    new Sprite (-1000, 0, 20, 1000000, 'k')
                ],
                player: new Player(-150, height -20, 30, 100),
                finish:  new Finish(1300, 200, 100, 40)

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
                player: new Player(100, 160, 30, 100),
                finish:  new Finish(400, 400, 100, 40)

            };

            break;
    
        default:
            //homescreen ofzo;
            break;
    }
}
    
