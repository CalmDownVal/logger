import type { TimeFormatter } from '~/types';
import { intToStringPad2 } from '~/utils/internal';

export class IsoTimeFormatter implements TimeFormatter {
	public constructor(
		public readonly timeZoneOffset: number
	) {}

	public format(timestamp: number) {
		const date = new Date(timestamp + this.timeZoneOffset);
		return `${intToStringPad2(date.getUTCHours())}:${intToStringPad2(date.getUTCMinutes())}:${intToStringPad2(date.getUTCSeconds())}`;
	}

	public static readonly localTimeZone = (() => {
		const date = new Date();
		return new IsoTimeFormatter(date.getTimezoneOffset());
	})();
}
