export default class Canvas {
	constructor(canvas, width, height) {
		this.canvas = canvas;
		this.canvas.width = width;
		this.canvas.height = height;
		this.dotDistance = 10;
		this.ctx = this.canvas.getContext("2d");
		this.ctx.lineCap = "round";
	}

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	paintBall(x, y, r, color) {
		this.ctx.beginPath();
		if (arguments.length === 1 || arguments.length === 2) {
			this.ctx.fillStyle = y || x.color;
			this.ctx.arc(x.x, x.y, x.r, 0, 6.3);
		} else {
			this.ctx.fillStyle = color;
			this.ctx.arc(x, y, r, 0, 6.3);
		}
		this.ctx.fill();
	}

	/**
	 * Paint a line from one point to another in a specified color
	 * @param deconstructed - x1, y1, x2, y2, color
	 * @param object - line, color
	 */
	paintLine() {
		this.ctx.setLineDash([]);
		this.__paintLine__(...arguments);
	}

	/**
	 * Paint a dotted line from one point to another in a specified color
	 * @param deconstructed - x1, y1, x2, y2, color
	 * @param object - line, color
	 */
	paintDottedLine() {
		this.ctx.setLineDash([1, this.dotDistance]);
		this.__paintLine__(...arguments);
	}

	__paintLine__() {
		this.ctx.beginPath();
		if (arguments.length === 1 || arguments.length === 2) {
			this.ctx.strokeStyle = arguments[1] || "black";
			this.ctx.moveTo(arguments[0].x1, arguments[0].y1);
			this.ctx.lineTo(arguments[0].x2, arguments[0].y2);
		} else {
			this.ctx.strokeStyle = arguments[4] || "black";
			this.ctx.moveTo(arguments[0], arguments[1]);
			this.ctx.lineTo(arguments[2], arguments[3]);
		}
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