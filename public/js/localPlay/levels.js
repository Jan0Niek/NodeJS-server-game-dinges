


function loadLevel(levelNum){
    switch (levelNum) {
        case 1:
            
            break;
    
        default:
            setTileSize(20)
            new Tiles(
                [
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    'bbbbbb.bbbbbbbb'
                ],
                -100,
                0,
                tileSize, 
                tileSize
            )
            break;
    }
}