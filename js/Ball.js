export default class Ball {
	static instances = [];
	constructor(x, y, r, color) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.color = color;
		
		Ball.instances.push(this);
		console.log(Ball.instances);
	}

	distanceToLine(line) {
		return Math.abs((line.x2-line.x1)*(line.y1-this.y) - (line.x1-this.x)*(line.y2-line.y1))/Math.sqrt((line.x2-line.x1)**2+(line.y2-line.y1)**2);
	}

	distanceToPoint(x, y) {
		return Math.sqrt(this.distanceToPointSquared(x, y))
	}

	distanceToPointSquared(x, y) {
		return (this.x - x)**2 + (this.y - y)**2;
	}

	shoot(x, y, velocity) {
		pass
	}
}