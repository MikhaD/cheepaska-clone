export default class Ball {
	static instances = [];
	constructor(x, y, r, color) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.color = color;
		
		Ball.instances.push(this);
	}

	distanceToLine(line) {
		return Math.abs((line.x2-line.x1)*(line.y1-this.y) - (line.x1-this.x)*(line.y2-line.y1))/Math.sqrt((line.x2-line.x1)**2+(line.y2-line.y1)**2);
	}

	distanceToPoint(x, y) {
		return Math.sqrt(this.distanceToPointSquared(x, y));
	}

	distanceToPointSquared(x, y) {
		return (this.x - x)**2 + (this.y - y)**2;
	}

	/**
	 * Set the quadrent of the ball relative to another, origin ball
	 * @param {Number} x - The x coord of the ball this ball's quadrent is relative to
	 * @param {Number} y - The y coord of the ball this ball's quadrent is relative to
	 */
	setRelativeQuad(x, y) {
		// Quadrents
		//   1 | 2 
		//  ---○---
		//   3 | 4 
		if (this.y <= y) { this.quadrent = 1; }
		else { this.quadrent = 3; }

		if (this.x > x) { this.quadrent += 1; }
	}

	/**
	 * Return the coordinates of the center of a ball in the position it would be if it had the same radius and traveled along the line until it hit this one
	 * @param {Line} line The line the ball travels along
	 * @param {Number} distToLine OPTIONAL: The distance from this ball to the line if it has already been pre computed
	 * @returns {*} {x, y} if the balls collide, else null
	 */
	centerAtCollision(line, distToLine) {
		let x, y;
		distToLine = distToLine || this.distanceToLine(line);
		if (distToLine < this.r*2) {	
			const t = (
				Math.sqrt(this.distanceToPointSquared(line.x1, line.y1) - distToLine**2) -
				Math.sqrt((this.r*2)**2 - distToLine**2)
				) / line.length();

			const x = ((1-t)*line.x1+t*line.x2); 
			const y = ((1-t)*line.y1+t*line.y2); 
			return {x, y};
		}
		return null;
	}

	shoot(x, y, velocity) {
		pass
	}
}