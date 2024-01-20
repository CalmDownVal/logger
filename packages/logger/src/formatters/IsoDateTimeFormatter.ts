import type { TimeFormatter } from '~/types';
import { intToStringPad2 } from '~/utils/internal';

export class IsoDateTimeFormatter implements TimeFormatter {
	public constructor(
		public readonly timeZoneOffset: number
	) {}

	public format(timestamp: number) {
		const date = new Date(timestamp + this.timeZoneOffset);
		return (
			`${date.getUTCFullYear()}-${intToStringPad2(date.getUTCMonth() + 1)}-${intToStringPad2(date.getUTCDate())}` +
			`T${intToStringPad2(date.getUTCHours())}:${intToStringPad2(date.getUTCMinutes())}:${intToStringPad2(date.getUTCSeconds())}`
		);
	}

	public static readonly localTimeZone = (() => {
		const date = new Date();
		return new IsoDateTimeFormatter(date.getTimezoneOffset());
	})();
}
