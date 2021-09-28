import Line from "./Line.js";
import Ball from "./Ball.js";
import { updateDebug } from "./functions.js";

export default class Game {
	constructor(bCanv, cCanv, radius, lineWidth, debug) {
		this.bCanv = bCanv;
		this.cCanv = cCanv;
		this.radius = radius;
		this.lineWidth = lineWidth;
		this.debug = debug || false;
		this.drawing = false;
		this.activeBall = null;
	}

	addBalls() {
		this.addBall(new Ball(293, 407, this.radius, "#CE928C"));
		this.addBall(new Ball(406, 422, this.radius, "#CE928C"));
		this.addBall(new Ball(268, 212, this.radius, "#CE928C"));
		this.addBall(new Ball(123, 266, this.radius, "#CE928C"));
	}

	addBall(ball) {
		this.bCanv.paintBall(ball);
	}

	aim(e) {
		if (this.drawing) {
			let collided = false;

			const cx = this.X(e.clientX);
			const cy = this.Y(e.clientY);

			this.cCanv.clear();

			if (this.debug) {
				this.cCanv.paintDottedLine(new Line(this.activeBall.x, 0, this.activeBall.x, this.cCanv.getHeight()));
				this.cCanv.paintDottedLine(new Line(0, this.activeBall.y, this.cCanv.getWidth(), this.activeBall.y));
				this.cCanv.paintLine(new Line(this.activeBall.x, this.activeBall.y, cx, cy), this.lineWidth, "teal");
			}

			const pullBack = new Line(this.activeBall.x, this.activeBall.y, cx, cy);
			const line = pullBack.extend(this.cCanv);

			const quad1 = Line.getRelativeQuad(cx, cy, this.activeBall.x, this.activeBall.y);
			let quad2;
			if (Math.abs(cx - this.activeBall.x) < Math.abs(cy - this.activeBall.y)) {
				quad2 = quad1 + (quad1 % 2 === 0 ? -1 : 1);
			} else {
				quad2 = quad1 + (quad1 > 2 ? -2 : 2);
			}
			for (const ball of Ball.instances) {
				const dist = ball.distanceToLine(line);

				if (ball !== this.activeBall && dist < ball.r * 2 && ball.quadrent !== quad1 && ball.quadrent !== quad2) {
					collided = true;
					const { x, y } = ball.centerAtCollision(line, dist);

					if (this.debug) {
						this.cCanv.paintBall(ball, "red");
						this.cCanv.paintBall(x, y, this.radius, "#0003");
						this.cCanv.paintDottedLine(new Line(line.x1, line.y1, x, y), this.lineWidth, this.radius * 2, "black");
						updateDebug({x: cx, y: cy, m: line.getGradient(), c: line.getIntercept()});
					}
					break;
				}
			}
			if (!this.debug || !collided) {
				this.cCanv.paintDottedLine(line, this.lineWidth, this.radius * 2, "black");
			}	

			const power = Math.floor(pullBack.getLengthSquared() / 1000);
			power * this.radius * 2
			const {x, y} = line.pointAtDistance(power * (this.radius*2 + 1));
			this.cCanv.paintBall(x, y, 5, "#FF9694");
			updateDebug({ power });
		}
	}

	/**
	 * Convert an x value relative to the browser window into one relative to the game board
	 * @param {Number} x A browser x coordinate
	 * @returns {Number} An x coordinate relative to the game
	 */
	X(x) { return x - this.bCanv.getBoundingClientRect().left; }

	/**
	 * Convert an x value relative to the browser window into one relative to the game board
	 * @param {Number} y A browser y coordinate
	 * @returns {Number} A y coordinate relative to the game
	 */
	Y(y) { return y - this.bCanv.getBoundingClientRect().top; }
}