//bovenaan setup
//eronder de draw overriden
const scenes = 
{
    menu: () => {
        let emojiFinger = loadImage("assets/finger_pointing_at_you.svg");

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

        let player1Exists;
        let player2Exists;

        textStyle(BOLD);
        strokeWeight(1);    

        let button1 = new Button(200, 400, 300, 100, color(200, 80, 160), 'P1', 20, requestToBePlayerX, (1), true, undefined, "P1: 🫵");
        let button2 = new Button(600, 400, 300, 100, color(200, 80, 160), 'P2', 20, requestToBePlayerX, (2), true, undefined, "P2: 🫵");

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
            let i=0;
            otherPlayers.forEach((otherP) => {
                text(otherP.username, 40, 24+i*textSize());
                i++;
                if(otherP.playerNum == 1) {
                    button1.text = `${button1.origText}: ${otherP.username}`;
                    player1Exists = true;
                }
                if(otherP.playerNum == 2) {
                    button2.text = `${button2.origText}: ${otherP.username}`;
                    player2Exists = true;
                }
            });

            if(!player1Exists)button1.text = button1.origText;
            if(!player2Exists)button2.text = button2.origText;
            if(myPlayerNum != -1){
                if(myPlayerNum == 1){
                    button1.img = emojiFinger;
                } else{
                    button2.img = emojiFinger;
                }
            }
            player1Exists = false;
            player2Exists = false;
            // button1.image = undefined;
            // button2.image = undefined;


        }
    }
}