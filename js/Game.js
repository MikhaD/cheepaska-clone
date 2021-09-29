import Line from "./Line.js";
import Ball from "./Ball.js";
import { updateDebug } from "./functions.js";

export default class Game {
	static friction = 1;
	static maxPower = 35;

	power = 0;
	drawing = false;
	activeBall = null;
	cueData = {w: 8, h: 100, gap: 3, offset: 0, tip: {h: 10}};

	constructor(bCanv, cCanv, radius, lineWidth, debug) {
		this.bCanv = bCanv;
		this.cCanv = cCanv;
		this.radius = radius;
		this.lineWidth = lineWidth;
		this.debug = debug || false;
	}

	addBalls() {
		this.addBall(new Ball(293, 407, this.radius, "#CE928C"));
		this.addBall(new Ball(406, 422, this.radius, "#CE928C"));
		this.addBall(new Ball(268, 212, this.radius, "#CE928C"));
		this.addBall(new Ball(123, 266, this.radius, "#CE928C"));
	}

	addBall(ball) {
		this.bCanv.setShadow("#000", 5);
		this.bCanv.paintBall(ball);
	}

	aim(e) {
		if (this.drawing) {
			let collided = false;

			const cx = this.X(e.clientX);
			const cy = this.Y(e.clientY);

			this.cCanv.clear();

			const pullBack = new Line(this.activeBall.x, this.activeBall.y, cx, cy);
			this.line = pullBack.extend(this.cCanv);
			
			const quad1 = Line.getRelativeQuad(cx, cy, this.activeBall.x, this.activeBall.y);
			let quad2;
			if (Math.abs(cx - this.activeBall.x) < Math.abs(cy - this.activeBall.y)) {
				quad2 = quad1 + (quad1 % 2 === 0 ? -1 : 1);
			} else {
				quad2 = quad1 + (quad1 > 2 ? -2 : 2);
			}

			if (this.debug) {
				updateDebug({x: cx, y: cy, m: this.line.getGradient()});
				this.cCanv.paintDottedLine(new Line(this.activeBall.x, 0, this.activeBall.x, this.cCanv.getHeight()));
				this.cCanv.paintDottedLine(new Line(0, this.activeBall.y, this.cCanv.getWidth(), this.activeBall.y));
				// this.cCanv.paintLine(pullBack, this.lineWidth, "teal");
			}

			for (const ball of Ball.instances) {
				const dist = ball.distanceToLine(this.line);

				if (ball !== this.activeBall && dist < ball.r * 2 && ball.quadrent !== quad1 && ball.quadrent !== quad2) {
					collided = true;
					const { x, y } = ball.centerAtCollision(this.line, dist);

					if (this.debug) {
						this.cCanv.paintBall(ball, "red");
						this.cCanv.paintBall(x, y, this.radius, "#0003");
						this.cCanv.paintDottedLine(new Line(this.line.x1, this.line.y1, x, y), this.lineWidth, this.radius * 2, "black");
					}
					break;
				}
			}
			if (!this.debug || !collided) {
				this.cCanv.paintDottedLine(this.line, this.lineWidth, this.radius * 2, "black");
			}
			// ############################################ Power ############################################
			this.power = Math.min(pullBack.getLengthSquared() / 1000, Game.maxPower);
			const {x, y} = this.line.pointAtDistance(Math.round(this.power) * this.radius * 2);
			this.cCanv.setShadow("#000", 2);
			this.cCanv.paintBall(x, y, 5, "#FF9694");
			this.cCanv.setShadow();
			updateDebug({ power: this.power });

			// ############################################# Cue #############################################
			const rotation = -1*Math.atan(pullBack.getGradient()) + ((quad1%2===0)? 0 : Math.PI);
			this.cCanv.ctx.translate(this.activeBall.x, this.activeBall.y);
			this.cCanv.ctx.rotate(rotation);
			this.cCanv.setShadow("#000", 4);
			this.cueData.offset = this.cueData.w/2 + this.radius + this.power;
			this.cCanv.fillPath(new Path2D(`
				M${this.cueData.offset},-${this.cueData.w/2}
				l${this.cueData.tip.h},0
				l0,${this.cueData.w}
				l-${this.cueData.tip.h},0
				a${this.cueData.w/2},${this.cueData.w/2},0,0,1,0,-${this.cueData.w}z
				m${this.cueData.tip.h+this.cueData.gap},0
				l${this.cueData.h},0
				a${this.cueData.w/2},${this.cueData.w/2},0,0,1,0,${this.cueData.w}
				l-${this.cueData.h},0z`
			), "white");

			this.cCanv.setShadow("#000", 0);
			this.cCanv.ctx.rotate(-1*rotation);
			this.cCanv.ctx.translate(this.activeBall.x*-1, this.activeBall.y*-1);
			updateDebug({ rotation });
		}
	}

	shoot() {
		if (Math.round(this.power) >= 1) {
			// need where its coming from and where its going to, along with velocity
		} else {
			this.cCanv.clear();
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