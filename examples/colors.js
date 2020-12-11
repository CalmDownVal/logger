const { ANSI16, ANSI16M, ANSI256 } = require('../build');

function testSystem(color, step = 255 / 11) {
	let str = '';
	for (let r = 0; r < 256; r += step) {
		for (let g = 0; g < 256; g += step) {
			for (let b = 0; b < 256; b += step) {
				str += `${color.bg((Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b))} `;
			}
		}
		str += `${color.reset}\n`;
	}

	const adjusted = 255 / (Math.pow(Math.floor(255 / step) + 1, 2) - 1);
	for (let i = 0; i < 256; i += adjusted) {
		const v = Math.round(i);
		str += `${color.bg((v << 16) | (v << 8) | v)} `;
	}

	console.log(str + color.reset);
}

testSystem(ANSI16);
testSystem(ANSI256);
testSystem(ANSI16M);
