export default class Canvas {
	constructor(canvas, width, height) {
		this.canvas = canvas;
		this.canvas.width = width;
		this.canvas.height = height;
		this.ctx = this.canvas.getContext("2d");
	}

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	paintBall(ball, color) {
		this.ctx.fillStyle = color || ball.color;
		this.ctx.beginPath();
		this.ctx.arc(ball.x, ball.y, ball.r, 0, 6.3);
		this.ctx.fill();
	}

	paintLine(x1, y1, x2, y2, color) {
		this.ctx.beginPath();
		if (arguments.length === 1 || arguments.length === 2) {
			this.ctx.strokeStyle = y1;
			this.ctx.moveTo(x1.from.x, x1.from.y);
			this.ctx.lineTo(x1.to.x, x1.to.y);
		} else {
			this.ctx.strokeStyle = color;
			this.ctx.moveTo(x1, y1);
			this.ctx.lineTo(x2, y2);

		}
		this.ctx.closePath();
		this.ctx.stroke();
	}

	addEventListener(event, callback) {
		this.canvas.addEventListener(event, callback);
	}

	setStrokeWidth(width) {
		this.ctx.lineWidth = width;
	}

	X(x) {
		return x - this.canvas.getBoundingClientRect().left;
	}
	
	Y(y) {
		return y - this.canvas.getBoundingClientRect().top;
	}

	getWidth() {
		return this.canvas.width;
	}

	getHeight() {
		return this.canvas.height;
	}
}