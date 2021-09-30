import Line from "./Line.js";
import Ball from "./Ball.js";
import { updateDebug } from "./functions.js";

export default class Game {
	static friction = 0.2;
	static maxPower = 35;
	static fps = 60;

	power = 0;
	drawing = false;
	activeBall = null;
	collided = null;
	cueData = {w: 8, h: 100, gap: 3, offset: 0, tip: {h: 10}};

	constructor(bCanv, cCanv, radius, lineWidth, debug) {
		this.bCanv = bCanv;
		this.cCanv = cCanv;
		this.radius = radius;
		this.lineWidth = lineWidth;
		this.debug = debug || false;
	}

	addBall(ball) {
		this.bCanv.setShadow("#000", 5);
		this.bCanv.paintBall(ball);
	}

	addCue(offset) {
		this.cueData.offset = this.cueData.w/2 + this.radius + offset;
		const rotation = -1*Math.atan(this.pullBack.gradient) + (this.pullBack.quad1%2) * Math.PI;
		this.cCanv.ctx.translate(this.activeBall.x, this.activeBall.y);
		this.cCanv.ctx.rotate(rotation);
		this.cCanv.setShadow("#000", 4);
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

	aim(e) {
		if (this.drawing) {
			this.collided = null;

			const cx = this.X(e.clientX);
			const cy = this.Y(e.clientY);

			this.cCanv.clear();

			this.pullBack = new Line(this.activeBall.x, this.activeBall.y, cx, cy);
			this.line = this.pullBack.extend(this.cCanv);
			
			this.pullBack.quad1 = Line.getRelativeQuad(cx, cy, this.activeBall.x, this.activeBall.y);
			if (Math.abs(this.pullBack.gradient) > 1) {
				// if quad1 is even subtract one, else add one
				this.pullBack.quad2 = this.pullBack.quad1 - (-1)**(this.pullBack.quad1%2);
			} else {
				// if quad is greater than 2 subtract 2, else add 2
				this.pullBack.quad2 = this.pullBack.quad1 + (-1)**(this.pullBack.quad1>2) * 2;
			}

			if (this.debug) {
				updateDebug({x: cx, y: cy, m: this.line.gradient});
				this.cCanv.paintDottedLine(new Line(this.activeBall.x, 0, this.activeBall.x, this.cCanv.getHeight()));
				this.cCanv.paintDottedLine(new Line(0, this.activeBall.y, this.cCanv.getWidth(), this.activeBall.y));
			}

			for (const ball of Ball.instances) {
				const dist = ball.distanceToLine(this.line);

				if (ball !== this.activeBall && dist < ball.r * 2 && ball.quadrent !== this.pullBack.quad1 && ball.quadrent !== this.pullBack.quad2) {
					this.collided = ball;
					const { x, y } = ball.centerAtCollision(this.line, dist);

					if (this.debug) {
						this.cCanv.paintBall(ball, "red");
						this.cCanv.paintBall(x, y, this.radius, "#0003");
						this.cCanv.paintDottedLine(new Line(this.activeBall.x, this.activeBall.y, x, y), this.lineWidth, this.radius * 2, "black");
					}
					break;
				}
			}
			if (!this.debug || !this.collided) {
				this.cCanv.paintDottedLine(this.line, this.lineWidth, this.radius * 2, "black");
			}
			// ############################################ Power ############################################
			this.power = Math.min(this.pullBack.getLengthSquared() / 1000, Game.maxPower);
			const {x, y} = this.line.pointAtDistance(Math.round(this.power) * this.radius * 2);
			this.cCanv.setShadow("#000", 2);
			this.cCanv.paintBall(x, y, 5, "#FF9694");
			this.cCanv.setShadow();
			updateDebug({ power: this.power });

			// ############################################# Cue #############################################
			this.addCue(this.power);
			this.cCanv.paintBall(this.activeBall);
		}
	}

	shoot() {
		if (Math.round(this.power) >= 1) {
			this.cCanv.clear();
			this.addCue(0);
			setTimeout(() => {
				this.cCanv.clear();
				requestAnimationFrame(moveBall);
			}, 1000/Game.fps);

			const moveBall = () => {
				setTimeout(() => {
					this.activeBall.x += this.power * (this.line.run/this.line.length);
					this.activeBall.y -= this.power * (this.line.rise/this.line.length);
					this.bCanv.clear();
					for (const ball of Ball.instances) {
						this.bCanv.paintBall(ball);
					}
					this.power -= Game.friction;
					if (this.power > 0) { requestAnimationFrame(moveBall); }
				}, 1000/Game.fps);
			};
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