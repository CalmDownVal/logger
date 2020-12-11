function splitChannels(color: number) {
	return [ (color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff ];
}

function getIndex(channel: number, min: number, max: number, step: number) {
	return Math.round(((channel < min ? min : channel > max ? max : channel) - min) / step);
}

function ANSI256_color(channel: number) {
	return channel < 48 ? 0 : 1 + getIndex(channel, 95, 255, 40);
}

function toANSI256(color: number) {
	const [ r, g, b ] = splitChannels(color);
	return r === g && g === b
		? r < 5 ? 16 : r > 246 ? 231 : 232 + getIndex(r, 8, 238, 10)
		: 16 + 36 * ANSI256_color(r) + 6 * ANSI256_color(g) + ANSI256_color(b);
}

function toANSI16(color: number) {
	const [ r, g, b ] = splitChannels(color);
	const index = (r > 100 ? 1 : 0) | (g > 100 ? 2 : 0) | (b > 100 ? 4 : 0);
	return (Math.max(r, g, b) > 200 ? 90 : 30) + index;
}

function toANSI16m(color: number) {
	const [ r, g, b ] = splitChannels(color);
	return `${r};${g};${b}`;
}

function createSystem(background: (color: number) => string, foreground: (color: number) => string) {
	return Object.freeze({
		bg: background,
		fg: foreground,
		reset: '\u001b[0m',
		resetBg: '\u001b[49m',
		resetFg: '\u001b[39m'
	});
}

export type ColorSystem = ReturnType<typeof createSystem>;

export const ANSI16 = createSystem(
	color => `\u001b[${toANSI16(color) + 10}m`,
	color => `\u001b[${toANSI16(color)}m`
);

export const ANSI256 = createSystem(
	color => `\u001b[48;5;${toANSI256(color)}m`,
	color => `\u001b[38;5;${toANSI256(color)}m`
);

export const ANSI16M = createSystem(
	color => `\u001b[48;2;${toANSI16m(color)}m`,
	color => `\u001b[38;2;${toANSI16m(color)}m`
);
