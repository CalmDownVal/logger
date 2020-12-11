import type { Transport } from '.';
import { defaultFormatter, LogFormatter } from '../format';
import { LogLevel } from '../LogLevel';

export interface TransportOptions {
	formatter?: LogFormatter;
	level?: LogLevel;
}

export abstract class TransportBase implements Transport {
	public level: LogLevel;

	private readonly formatter: LogFormatter;

	public constructor({
		formatter = defaultFormatter,
		level = LogLevel.Debug
	}: TransportOptions = {}) {
		this.formatter = formatter;
		this.level = level;
	}

	public log(message: string, level: LogLevel, tags: readonly string[]) {
		if (this.level === undefined || level >= this.level) {
			this.write(this.formatter(message, level, tags));
		}
	}

	protected abstract write(str: string): void;
}
