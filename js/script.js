import Game from "./Game.js";
import Canvas from "./Canvas.js";
import Ball from "./Ball.js";

const vmin = Math.min(innerHeight, innerHeight) / 100;
const width = Math.floor(60 * vmin);
const height = Math.floor(72 * vmin);
const margin = 5 * vmin;

const cueCanvas = new Canvas(document.querySelector("#cue"), width + 2 * margin, height + 2 * margin);
const ballCanvas = new Canvas(document.querySelector("#balls"), width + 2 * margin, height + 2 * margin);
ballCanvas.setShadow("#000", 5);

const game = new Game(ballCanvas, cueCanvas, 20, 5, true);
game.addBalls();

cueCanvas.addEventListener("contextmenu", e => {
	e.preventDefault();
	game.addBall(new Ball(game.X(e.clientX), game.Y(e.clientY), game.radius, "#CE928C"));
});

document.addEventListener("mousedown", e => {
	if (e.target.id === "cue" && e.button === 0) {
		for (const ball of Ball.instances) {
			if (ball.distanceToPointSquared(game.X(e.clientX), game.Y(e.clientY)) < ball.r**2) {
				game.drawing = true;
				game.activeBall = ball;
				Ball.instances.sort(function(a, b) {
					return a.distanceToPointSquared(game.activeBall.x, game.activeBall.y) - b.distanceToPointSquared(game.activeBall.x, game.activeBall.y);
				});
				for (const ball of Ball.instances) {
					ball.setRelativeQuad(game.activeBall.x, game.activeBall.y);
				}
				break;
			}
		}
	}
});

document.addEventListener("mousemove", (e) => game.aim(e));

document.addEventListener("mouseup", e => {
	if (e.button === 0) {
		game.drawing = false;
		game.cCanv.clear();
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