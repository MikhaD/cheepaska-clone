const debug = document.querySelector("#debug");
export function updateDebug(data) {
	for (const key in data) {
		let el = debug.querySelector(`.${key}`);
		if (!el) {
			el = document.createElement("div");
			el.classList = key;
			debug.appendChild(el);
		}
		el.textContent = `${key}: ${data[key]}`;
	}
}