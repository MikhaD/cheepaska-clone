// Quadrents
//   2 | 1 
//  ---○---
//   3 | 4 

// Area where balls are on the table: margin, margin, width, height

import Canvas from "./Canvas.js";
import Line from "./Line.js";
import Ball from "./Ball.js";

const radius = 20;	// 12 for actual game

const vmin = Math.min(innerHeight, innerHeight) / 100;
const width = Math.floor(60 * vmin);
const height = Math.floor(72 * vmin);
const margin = 5 * vmin;

const cCanv = new Canvas(document.querySelector("#cue"), width + 2 * margin, height + 2 * margin);
const bCanv = new Canvas(document.querySelector("#balls"), width + 2 * margin, height + 2 * margin);

cCanv.dotDistance = radius*2;

cCanv.setStrokeWidth(5);

const line = new Line(0, 0, 0, 0);
let drawing = false;
let activeBall = null;

cCanv.addEventListener("contextmenu", e => {
	e.preventDefault();

	bCanv.paintBall(new Ball(bCanv.X(e.clientX), bCanv.Y(e.clientY), radius, "#0008"));
});

document.addEventListener("mousedown", e => {
	if (e.target.id === "cue" && e.button === 0) {
		for (const ball of Ball.instances) {
			if (ball.distanceToPointSquared(bCanv.X(e.clientX), bCanv.Y(e.clientY)) < ball.r ** 2) {
				drawing = true;
				activeBall = ball;
				line.setStartPoint(ball.x, ball.y);
				Ball.instances.sort(function(a, b) {
					return a.distanceToPointSquared(line.x1, line.y1) - b.distanceToPointSquared(line.x1, line.y1)
				});
				break;
			}
		}
	}
});

document.addEventListener("mousemove", e => {
	const cx = cCanv.X(e.clientX);
	const cy = cCanv.Y(e.clientY);
	if (drawing) {
		const gradient = -1 * (cy - line.y1) / (cx - line.x1);
		const intercept = gradient * line.x1 + line.y1;

		cCanv.clear();

		cCanv.paintLine(line.x1, line.y1, cx, cy, "teal");

		// if pointing vertical
		if (cx === line.x1) {
			line.x2 = line.x1;
			if (cy > line.y1) { line.y2 = 0; }		// vertically up
			else { line.y2 = cCanv.getHeight(); }	// vertically down
		}
		// if pointing up (quadrents 1 and 2)
		else if (cy > line.y1) {
			line.setEndPoint(intercept / gradient, 0);
		}
		// if pointing down
		else if (cy < line.y1) {
			// if pointing down to the right (quadrent 4)
			if (cx < line.x1) {
				line.setEndPoint(cCanv.getWidth(), -1 * gradient * cCanv.getWidth() + intercept);
			}
			// if pointing down to the left (quadrent 3)
			else {
				line.setEndPoint(0, intercept);
			}
		}
		// if pointing horizontal
		else {
			if (cx > line.x1) { line.x2 = 0; }		// horizontally left
			else { line.x2 = cCanv.getWidth(); }	// horizontally right
			line.y2 = line.y1;
		}
		let colliding = false;

		for (const ball of Ball.instances) {
			const dist = ball.distanceToLine(line);
			if (ball !== activeBall && dist < ball.r * 2) {
				colliding = true;
				cCanv.paintBall(ball, "red");
				const toStart = ball.distanceToPointSquared(line.x1, line.y1);
				const long = Math.sqrt(toStart - dist ** 2);
				const short = Math.sqrt((radius * 2) ** 2 - dist ** 2);

				const t = (long - short) / line.length();

				const x = ((1-t)*line.x1+t*line.x2); 
				const y = ((1-t)*line.y1+t*line.y2); 

				cCanv.paintDottedLine(line.x1, line.y1, x, y, "red");
				cCanv.paintBall(x, y, radius, "#0005");
				break;
			}
		}

		if (!colliding) {
			cCanv.paintDottedLine(line, "red");
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

const updateDebugData = (function () {
	const dx = document.querySelector("#x");
	const dy = document.querySelector("#y");
	const dm = document.querySelector("#m");
	const dc = document.querySelector("#c");

	return function (x, y, m, c) {
		dx.textContent = x || 0;
		dy.textContent = y || 0;
		dm.textContent = m || 0;
		dc.textContent = c || 0;
	};
})();