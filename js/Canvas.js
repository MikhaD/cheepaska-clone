export default class Canvas {
	constructor(canvas, width, height) {
		this.canvas = canvas;
		this.canvas.width = width;
		this.canvas.height = height;
		this.ctx = this.canvas.getContext("2d");
		this.ctx.lineCap = "round";
	}

	/** Erase everything on the canvas */
	clear() { this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); }

	/**
	 * Paint a ball at a given x and y with a given radius and color. Takes either a ball object or coordinates and a radius
	 * @param {*} - x, y, z color
	 * @param {*} - Ball, color
	 */
	paintBall() {
		this.ctx.beginPath();
		if (arguments.length === 1 || arguments.length === 2) {
			this.ctx.fillStyle = arguments[1] || arguments[0].color;
			this.ctx.arc(arguments[0].x, arguments[0].y, arguments[0].r, 0, 6.3);
		} else {
			this.ctx.fillStyle = arguments[3] || "black";
			this.ctx.arc(arguments[0], arguments[1], arguments[2], 0, 6.3);
		}
		this.ctx.fill();
	}

	/**
	 * Paint a line of a given line width, dot distance and color
	 * @param {Line} line The line to paint
	 * @param {Number} width The width of the line (1 by default)
	 * @param {String} color The color of the line (black by default)
	 */
	paintLine(line, width, color) {
		this.ctx.setLineDash([]);
		this.__paintLine__(line, width, color);
	}

	/**
	 * Paint a dotted line of a given line width, dot distance and color
	 * @param {Line} line The line to paint
	 * @param {Number} width The width of the line (1 by default)
	 * @param {Number} distance The distance between the dots (10 by default)
	 * @param {String} color The color of the line (black by default)
	 */
	paintDottedLine(line, width, distance, color) {
		this.ctx.setLineDash([0, distance || 10]);
		this.__paintLine__(line, width, color);
	}

	__paintLine__(line, width, color) {
		this.ctx.beginPath();
		this.ctx.lineWidth = width || 1;
		this.ctx.strokeStyle = color || "black";
		this.ctx.moveTo(line.x1, line.y1);
		this.ctx.lineTo(line.x2, line.y2);
		this.ctx.stroke();
	}

	/**
	 * Draw a shape to the canvas represented as a Path2D path
	 * @param {Path2D} path The Path2D object to draw to the canvas
	 * @param {String} color The fill color of the shape (defualt: black)
	 */
	fillPath(path, color) {
		this.ctx.fillStyle = color || "black";
		this.ctx.fill(path);
	}

	/**
	 * Draw a shape to the canvas represented as a Path2D path
	 * @param {Path2D} path The Path2D object to draw to the canvas
	 * @param {String} color The outline color of the shape (defualt: black)
	 * @param {Number} width The width of the outline of the shape (default: 1)
	 */
	strokePath(path, color, width) {
		this.ctx.lineWidth = width || 1;
		this.ctx.strokeStyle = color || "black";
		this.ctx.stroke(path);
	}

	addEventListener(event, callback) {
		this.canvas.addEventListener(event, callback);
	}

	setStrokeWidth(width) {
		this.ctx.lineWidth = width;
	}

	/**
	 * Define the shadow for all future draws to the canvas
	 * @param {String} color The color of the shadow (default: black)
	 * @param {Number} blur The shadow blur (default: 0)
	 * @param {Number} xOffset The shadow's horizontal offset (defualt: 0)
	 * @param {Number} yOffset The shadow's vertical offset (default: 0)
	 */
	setShadow(color, blur, xOffset, yOffset) {
		this.ctx.shadowColor = color || "black";
		this.ctx.shadowBlur = blur || 0;
		this.ctx.shadowOffsetX = xOffset || 0;
		this.ctx.shadowOffsetY = yOffset || 0;
	}

	getWidth() {
		return this.canvas.width;
	}

	getHeight() {
		return this.canvas.height;
	}

	setDimensions(width, height) {
		this.canvas.width = width;
		this.canvas.height = height;
	}

	getBoundingClientRect() {
		return this.canvas.getBoundingClientRect();
	}
}