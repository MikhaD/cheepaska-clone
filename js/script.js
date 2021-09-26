// Quadrents
//   2 | 1 
//  ---○---
//   3 | 4 

// Area where balls are on the table: margin, margin, width, height

import Canvas from "./Canvas.js";
import Ball from "./Ball.js";

const balls = [];

const vmin = Math.min(innerHeight, innerHeight) / 100;
const width = Math.floor(60*vmin);
const height = Math.floor(72*vmin);
const margin = 5*vmin;

const cCanv = new Canvas(document.querySelector("#cue"), width + 2*margin, height + 2*margin);
const bCanv = new Canvas(document.querySelector("#balls"), width + 2*margin, height + 2*margin);

cCanv.setStrokeWidth(3);

const line = {from: {x: 0, y:0}, to: {x: 0, y: 0}};
let drawing = false;

cCanv.addEventListener("contextmenu", e => {
	e.preventDefault();

	const ball = new Ball(bCanv.X(e.clientX), bCanv.Y(e.clientY), 12, "#0008");
	bCanv.paintBall(ball);
	balls.push(ball);
});

document.addEventListener("mousedown", e => {
	if (e.target.id === "cue" && e.button === 0) {
		for (const ball of balls) {
			if (ball.distanceToPoint(bCanv.X(e.clientX), bCanv.Y(e.clientY)) < ball.r) {
				drawing = true;
				line.from.x = ball.x;
				line.from.y = ball.y;
				break;
			}
		}
	}
});

document.addEventListener("mousemove", e => {
	const cx = cCanv.X(e.clientX);
	const cy = cCanv.Y(e.clientY);
	if (drawing) {
		const gradient = -1 * (cy - line.from.y) / (cx - line.from.x);
		const intercept = gradient*line.from.x + line.from.y;

		cCanv.clear();

		cCanv.paintLine(line.from.x, line.from.y, cx, cy, "teal");
		
		// if pointing vertical
		if (cx === line.from.x) {
			line.to.x = line.from.x;
			if (cy > line.from.y) { line.to.y = 0; }	// vertically up
			else { line.to.y = cCanv.getHeight(); }		// vertically down
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
				line.to.x = cCanv.getWidth();
				line.to.y = -1*gradient*cCanv.getWidth() + intercept;
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
			else { line.to.x = cCanv.getWidth(); }		// horizontally right
			line.to.y = line.from.y;
		}
		cCanv.paintLine(line, "red");

		for (const ball of balls) {
			if (ball.distanceToLine(line) < ball.r) {
				cCanv.paintBall(ball, "red");
			}
		}

		updateDebugData(cx, cy, gradient, intercept);
	} else {
		if (e.target.id === "cue") updateDebugData(cx, cy);
	}
});

document.addEventListener("mouseup", e => {
	if (e.button === 0) {
		drawing = false;
		cCanv.clear();
	}
});

const updateDebugData = (function() {
	const dx = document.querySelector("#x");
	const dy = document.querySelector("#y");
	const dm = document.querySelector("#m");
	const dc = document.querySelector("#c");

	return function(x, y, m, c) {
		dx.textContent = x || 0;
		dy.textContent = y || 0;
		dm.textContent = m || 0;
		dc.textContent = c || 0;
	};
})();