export default class Line {
	constructor(x1, y1, x2, y2) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.rise = y1-y2;
		this.run = x2-x1;
		this.gradient = this.rise/this.run;
		this.intercept = this.gradient*x1 + y1;
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
		return 1 + (x>xOrigin) + 2*(y>yOrigin);
	}

	/**
	 * Calculate and return the length of the line. Calculation done in function instead of constructor for efficiency in case length isn't needed
	 * @returns {Number} The length of the line
	 */
	getLength() {
		if (!this.length) {
			this.length = Math.sqrt(this.getLengthSquared());
		}
		return this.length;
	}

	/**
	 * Calculate and return the square of the length of the line. Calculation done in function instead of constructor for efficiency in case length isn't needed. Length uses the sqrt function which is expensive and isn't always neccessary. Comparing two lengths to see which is longer, for example, works with the squares or the lengths.
	 * @returns {Number} The length of the line squared
	 */
	getLengthSquared() {
		if (!this.lengthSquared) {
			this.lengthSquared = this.rise ** 2 + this.run ** 2;
		}
		return this.lengthSquared;
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
			x = this.intercept / this.gradient;
			y = 0;
		}
		// if pointing down
		else if (this.y2 < this.y1) {
			// if pointing down to the right (quadrent 4)
			if (this.x2 < this.x1) {
				x = canvas.getWidth();
				y = -1 * this.gradient * canvas.getWidth() + this.intercept;
			}
			// if pointing down to the left (quadrent 3)
			else {
				x = 0;
				y = this.intercept;
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