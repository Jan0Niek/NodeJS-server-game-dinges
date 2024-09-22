//bovenaan setup
//eronder de draw overriden
const scenes = 
{
    gaming: () => {
        allSprites.removeAll();

        let gamerData;
        socket.on("gameData", (data) => {
            gamerData = data;
        });

        let pressedKeys = [];
        draw = () => {
            background(255);

            pressedKeys = [];
            if(kb.pressing("w")) pressedKeys.push("w");
            if(kb.pressing("a")) pressedKeys.push("a");
            if(kb.pressing("s")) pressedKeys.push("s");
            if(kb.pressing("d")) pressedKeys.push("d");
            socket.emit("pressedKeys", pressedKeys);

            if (gamerData && gamerData.sprites) {
                rect(gamerData.sprites[0].x, gamerData.sprites[0].y, gamerData.sprites[0].w, gamerData.sprites[0].h);
                text(gamerData.sprites[0].text, gamerData.sprites[0].x, gamerData.sprites[0].y);
            }
        }
    },

    menu: () => {
        const Button = declareButton();
        textStyle(BOLD);
        strokeWeight(1);
        // let emojiFinger = loadImage("assets/finger_pointing_at_you.svg");

        const requestToBePlayerX = (playerNum) => {
            // console.log('knop nr ' + playerNum + ' gedrukt')
            socket.emit("requestToBePlayerX", (playerNum))
        }
        let readiness = false;
        const readyUp = () =>{
            if(myPlayerNum == -1) return; //fake assert
            readiness = !readiness;
            socket.emit("readyUp", (readiness));
        }


        textStyle(BOLD);
        strokeWeight(1);    

        let button1 = new Button(200, 400, 300, 100, color(200, 80, 160), 'P1', 20, requestToBePlayerX, (1), false, color(160, 20, 100));
        let button2 = new Button(600, 400, 300, 100, color(200, 80, 160), 'P2', 20, requestToBePlayerX, (2), false, color(160, 20, 100));

        let readyButton = new Button(canvas.hw, 680, 300, 40, color(20, 240, 20), "Ready up", 40, readyUp, null, true, color(0, 60, 0), "Readied", color(0, 0, 0), color(240, 240, 240));
        readyButton.autoDraw = false;

        draw = () => {
            background(255);
            // allSprites.draw()

            button1.checkPressed();
            button2.checkPressed();
            button1.draw();
            button2.draw();
            
            if(myPlayerNum != -1){
                readyButton.checkPressed();
                readyButton.draw()
            }
            
            
            text("my name is: " + chosenUsername, canvas.hw, 40);
            text("i'm player " + myPlayerNum, canvas.hw, 50);
            text("OTHER players in lobby: ", 40, textSize());
            
            button1.text = button1.origText;
            button2.text = button2.origText;
            button1.color = button1.origColor;
            button2.color = button2.origColor;
            
            let i=0;
            otherPlayers.forEach((otherP) => {
                text(otherP.username, 40, 24+i*textSize());
                i++;
                if(otherP.playerNum == 1) {
                    if(otherP.ready){
                        button1.text = `${button1.origText}: ${otherP.username} \n READY`;
                    }else {
                        button1.text = `${button1.origText}: ${otherP.username} \n unready`;
                    }
                }
                if(otherP.playerNum == 2) {
                    if(otherP.ready){
                        button2.text = `${button2.origText}: ${otherP.username} \n READY`;
                    }else {
                        button2.text = `${button2.origText}: ${otherP.username} \n unready`;
                    }                
                }
            });

            if(myPlayerNum == 1){
                button1.text = `${button1.origText}: 🫵 (you!)`;
                button1.color = button1.col2;
            }else if(myPlayerNum == 2){
                button2.text = `${button2.origText}: 🫵 (you!)`;
                button2.color = button2.col2;
            }

        }
    }
}