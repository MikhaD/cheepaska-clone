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
	const cx = e.clientX - rect.left;
	const cy = e.clientY - rect.top;

	bCtx.fillStyle = "#0008";
	e.preventDefault();
	bCtx.beginPath();
	bCtx.arc(cx, cy, 12, 0, 6.3);
	bCtx.fill();
	balls.push(new Ball(cx, cy, 12));
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
			// if pointing vertical up
			if (cy > line.from.y) {
				cCtx.lineTo(line.from.x, 0);
			}
			// if pointing vertical down
			else {
				cCtx.lineTo(line.from.x, cueCanvas.height);
			}
		}
		// if pointing up (quadrents 1 and 2)
		else if (cy > line.from.y) {
			cCtx.lineTo(intercept/gradient, 0);
		}
		// if pointing down
		else if (cy < line.from.y) {
			// if pointing down to the right (quadrent 4)
			if (cx < line.from.x) {
				cCtx.lineTo(cueCanvas.width, -1*gradient*cueCanvas.width + intercept);
			}
			// if pointing down to the left (quadrent 3)
			else {
				cCtx.lineTo(0, intercept);
			}
		}
		// if pointing horizontal
		else {
			// if pointing horizontally left
			if (cx > line.from.x) {
				cCtx.lineTo(0, line.from.y);
			}
			// if pointing horizontally right
			else {
				cCtx.lineTo(cueCanvas.width, line.from.y);
			}
		}
		cCtx.closePath();
		cCtx.stroke();

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
	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
	}
}