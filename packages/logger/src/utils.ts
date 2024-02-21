export function joinLabels(currentLabel: string, subLabel: string) {
	return currentLabel + '.' + subLabel;
}

export function intToStringPad2(value: number) {
	const str = '' + Math.trunc(value);
	return str.length >= 2 ? str : '0' + str;
}

export function toStringOrJson(payload: unknown) {
	return typeof payload === 'string'
		? payload
		: JSON.stringify(payload);
}

export function getLocalTimeZoneOffset() {
	return new Date().getTimezoneOffset();
}

export function noop() {
	// do nothing
}
