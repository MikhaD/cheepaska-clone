export default class Ball {
	constructor(x, y, r, color) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.color = color;
	}

	distanceToLine(line) {
		return Math.abs((line.to.x-line.from.x)*(line.from.y-this.y) - (line.from.x-this.x)*(line.to.y-line.from.y))/Math.sqrt((line.to.x-line.from.x)**2+(line.to.y-line.from.y)**2);
	}

	distanceToPoint(x, y) {
		return Math.sqrt((this.x - x)**2 + (this.y - y)**2)
	}
}