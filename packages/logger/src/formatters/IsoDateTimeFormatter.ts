import type { TimeFormatter } from '~/types';
import { intToStringPad2 } from '~/utils/misc';

export class IsoDateTimeFormatter implements TimeFormatter {
	public constructor(
		public readonly timeZoneOffset: number
	) {}

	public format(timestamp: number) {
		const date = new Date(timestamp + this.timeZoneOffset);
		return (
			`${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}` +
			`T${intToStringPad2(date.getUTCHours())}:${intToStringPad2(date.getUTCMinutes())}:${intToStringPad2(date.getUTCSeconds())}`
		);
	}

	public static readonly localTimeZone = (() => {
		const date = new Date();
		return new IsoDateTimeFormatter(date.getTimezoneOffset());
	})();
}
