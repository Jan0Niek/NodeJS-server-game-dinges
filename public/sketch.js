let thing;

function setup() {
	new Canvas(500, 500);

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
	thing.applyForce(30, 40)
}

function draw() {
	background('gray');
	
	
}
