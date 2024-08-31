//bovenaan setup
//eronder de draw overriden
const scenes = 
{
    menu: () => {

        const requestToBePlayerX = (playerNum) => {
            console.log('knop nr ' + playerNum + ' gedrukt')
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

        let button1 = new Button(200, 400, 300, 100, color(200, 80, 160), 'P1', 20, requestToBePlayerX, (1));
        let button2 = new Button(600, 400, 300, 100, color(200, 80, 160), 'P2', 20, requestToBePlayerX, (2));

        let readyButton = new Button(canvas.hw, 680, 300, 40, color(20, 240, 20), "Ready up", 40, readyUp, null, true, color(0, 60, 0), "Readied");
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
            let i = 0;
            for (const name of otherPlayers) {
                text(name, 40, 20+i*textSize());
                i++;
            }
        }
    }
}