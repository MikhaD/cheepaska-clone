// Quadrents
//   2 | 1 
//  ---○---
//   3 | 4 

const cueCanvas = document.querySelector("#cue");
const ballsCanvas = document.querySelector("#balls");

const x = document.querySelector("#x");
const y = document.querySelector("#y");
const m = document.querySelector("#m");
const c = document.querySelector("#c");

const balls = [];

const vmin = Math.min(innerHeight, innerHeight) / 100;
const width = Math.floor(60*vmin);
const height = Math.floor(72*vmin);
const margin = 5*vmin;

cueCanvas.width = width + 2*margin;
cueCanvas.height = height + 2*margin;

ballsCanvas.width = width + 2*margin;
ballsCanvas.height = height + 2*margin;

const cCtx = cueCanvas.getContext("2d");
const bCtx = ballsCanvas.getContext("2d");
const rect = cueCanvas.getBoundingClientRect();
cCtx.lineWidth = 3;

function paintBackground() {
	cCtx.clearRect(0, 0, cueCanvas.width, cueCanvas.height);
	cCtx.fillStyle = "black";
	cCtx.fillRect(margin, margin, width, height);
}

const line = {from: {x: 0, y:0}, to: {x: 0, y: 0}};
let drawing = false;

cueCanvas.addEventListener("contextmenu", e => {
	e.preventDefault();

	const cx = e.clientX - rect.left;
	const cy = e.clientY - rect.top;

	const ball = new Ball(cx, cy, 12, "#0008");
	paintBall(ball);
	balls.push(ball);
});

cueCanvas.addEventListener("mousedown", e => {
	if (e.button === 0) {
		drawing = true;
		line.from.x = e.clientX - rect.left;
		line.from.y = e.clientY - rect.top;
	}
});

cueCanvas.addEventListener("mousemove", e => {
	if (drawing) {
		const cx = e.clientX - rect.left;
		const cy = e.clientY - rect.top;
		cCtx.clearRect(0, 0, cueCanvas.width, cueCanvas.height);

		cCtx.strokeStyle = "teal";
		cCtx.beginPath();
		cCtx.moveTo(line.from.x, line.from.y);
		cCtx.lineTo(cx, cy);
		cCtx.closePath();
		cCtx.stroke();
		
		cCtx.strokeStyle = "red";
		cCtx.beginPath();
		cCtx.moveTo(line.from.x, line.from.y);
		const gradient = -1 * (cy - line.from.y) / (cx - line.from.x);
		const intercept = gradient*line.from.x + line.from.y;
		// if pointing vertical
		if (cx === line.from.x) {
			line.to.x = line.from.x;
			if (cy > line.from.y) { line.to.y = 0; }	// vertically up
			else { line.to.y = cueCanvas.height; }		// vertically down
		}
		// if pointing up (quadrents 1 and 2)
		else if (cy > line.from.y) {
			line.to.x = intercept/gradient;
			line.to.y = 0;
		}
		// if pointing down
		else if (cy < line.from.y) {
			// if pointing down to the right (quadrent 4)
			if (cx < line.from.x) {
				line.to.x = cueCanvas.width;
				line.to.y = -1*gradient*cueCanvas.width + intercept;
			}
			// if pointing down to the left (quadrent 3)
			else {
				line.to.x = 0;
				line.to.y = intercept;
			}
		}
		// if pointing horizontal
		else {
			if (cx > line.from.x) { line.to.x = 0; }	// horizontally left
			else { line.to.x = cueCanvas.width; }		// horizontally right
			line.to.y = line.from.y;
		}
		cCtx.lineTo(line.to.x, line.to.y);
		cCtx.closePath();
		cCtx.stroke();

		for (const ball of balls) {
			if (ball.distanceToLine(line) < ball.r) {
				paintBall(ball, "red");
			}
		}
		if (balls.length > 0 && balls[0].distanceToLine(line) < balls[0].r) {
			paintBall(balls[0].x, balls[0].y, balls[0].r, "red");
		}

		x.textContent = cx;
		y.textContent = cy;
		m.textContent = gradient;
		c.textContent = intercept;
	}
});

cueCanvas.addEventListener("mouseup", e => {
	if (e.button === 0) {
		drawing = false;
	}
});

class Ball {
	constructor(x, y, r, color) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.color = color;
	}

	distanceToLine(line) {
		return Math.abs((line.to.x-line.from.x)*(line.from.y-this.y) - (line.from.x-this.x)*(line.to.y-line.from.y))/Math.sqrt((line.to.x-line.from.x)**2+(line.to.y-line.from.y)**2);
	}
}

function paintBall(ball, color) {
	bCtx.fillStyle = color || ball.color;
	bCtx.beginPath();
	bCtx.arc(ball.x, ball.y, ball.r, 0, 6.3);
	bCtx.fill();
}