export default class Line {
	constructor(x1, y1, x2, y2) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.gradient = null;
		this.intercept = null;
		this.lengthSquared = null;
		this.length = null;
	}

	/**
	 * Get the quadrent of a point relative to another, origin point
	 * @param {Number} x - The x coordinate of the point you want the quadrent of
	 * @param {Number} y - The y coordinate of the point you want the quadrent of
	 * @param {Number} xOrigin - The x coordinate of the origin point
	 * @param {Number} yOrigin - The y coordinate of the origin point
	 * @returns {Number} Quadrent
	 */
	static getRelativeQuad(x, y, xOrigin, yOrigin) {
		// Quadrents
		//   1 | 2 
		//  ---○---
		//   3 | 4 
		let quadrent;

		if (y <= yOrigin) { quadrent = 1; }
		else { quadrent = 3; }

		if (x > xOrigin) { quadrent += 1; }
		return quadrent;
	}

	getLength() {
		if (!this.length) {
			this.length = Math.sqrt(this.getLengthSquared());
		}
		return this.length;
	}

	getLengthSquared() {
		if (!this.lengthSquared) {
			this.lengthSquared = (this.x1 - this.x2) ** 2 + (this.y1 - this.y2) ** 2;
		}
		return this.lengthSquared;
	}

	/**
	 * Calculate the gradient of the line and return it. Calculation done in function instead of constructor for efficiency in case gradient isn't needed
	 * @returns The gradient of the line
	 */
	getGradient() {
		if (!this.gradient) {
			this.gradient = -1 * (this.y2 - this.y1) / (this.x2 - this.x1);
		}
		return this.gradient;
	}

	/**
	 * Calculate the y-intercept of the line and return it. Calculation done in function instead of constructor for efficiency in case y-intercept isn't needed
	 * @returns The y-intercept of the line
	 */
	getIntercept() {
		if (!this.intercept) {
			this.intercept = this.getGradient() * this.x1 + this.y1;
		}
		return this.intercept;
	}

	/**
	 * extend a line from its first point to the edge of the canvas
	 * @param {Canvas} canvas The canvas you want the line extened to the edge of
	 * @returns The new line from the firstpoint of the old line to the edge of the canvas
	 */
	extend(canvas) {
		let x, y;
		// if pointing vertical
		if (this.x2 === this.x1) {
			x = this.x1;
			if (this.y2 > this.y1) { y = 0; }	// vertically up
			else { y = canvas.getHeight(); }	// vertically down
		}
		// if pointing up (quadrents 1 and 2)
		else if (this.y2 > this.y1) {
			x = this.getIntercept() / this.getGradient();
			y = 0;
		}
		// if pointing down
		else if (this.y2 < this.y1) {
			// if pointing down to the right (quadrent 4)
			if (this.x2 < this.x1) {
				x = canvas.getWidth();
				y = -1 * this.getGradient() * canvas.getWidth() + this.getIntercept();
			}
			// if pointing down to the left (quadrent 3)
			else {
				x = 0;
				y = this.getIntercept();
			}
		}
		// if pointing horizontal
		else {
			if (this.x2 > this.x1) { x = 0; }	// horizontally left
			else { x = canvas.getWidth(); }		// horizontally right
			y = this.y1;
		}
		return new Line(this.x1, this.y1, x, y);
	}

	/**
	 * Find the coordinates of the point a given distance along the line
	 * @param {Number} distance The distance along the line, distance <= line.getLength()
	 * @returns {*} {x, y}
	 */
	pointAtDistance(distance) {
		const t = distance / this.getLength();
		const x = ((1 - t) * this.x1 + t * this.x2);
		const y = ((1 - t) * this.y1 + t * this.y2);
		return { x, y };
	}
}