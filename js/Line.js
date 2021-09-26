export default class Line {
	constructor(x1, y1, x2, y2, color) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.color = color;
	}

	length() {
		return Math.sqrt(this.lengthSquared());
	}

	lengthSquared() {
		return (this.x1 - this.x2) ** 2 + (this.y1 - this.y2) ** 2
	}

	setStartPoint(x, y) {
		this.x1 = x;
		this.y1 = y;
	}

	setEndPoint(x, y) {
		this.x2 = x;
		this.y2 = y;
	}
}