let thing;
let floor; //typescript?

function setup() {
	new Canvas(500, 500);
	world.gravity.y = 9.81;

	class Player extends Sprite{
		constructor(x, y, width, height){
			super(x, y, width, height, 'd')
			this.x = x;
			this.y = y;
			this.width = width
			this.height = height;
			// this.draw();
			
		}
	}
	thing = new Player(70, 70, 20, 40);
	new Sprite(130, 150, 20, 20)
	floor = new Sprite(250, height, width, 14, 'k')
}

function draw() {
	background('gray');
	floor.y--;
	
	
}
