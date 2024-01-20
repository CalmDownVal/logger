export function toStringOrJson(payload: unknown) {
	return typeof payload === 'string'
		? payload
		: JSON.stringify(payload);
}
