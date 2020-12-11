import type { Logger } from './Logger';
import { LogLevel } from './LogLevel';

export interface LogCallback {
	(message: string, level: LogLevel, tags: readonly string[]): void;
}

export class ProxyLogger implements Logger {
	public constructor(
		protected readonly callback: LogCallback,
		public readonly tags: readonly string[] = []) {}

	public getChildLogger(tag: string) {
		return new ProxyLogger(this.callback, this.tags.concat(tag));
	}

	public log(message: string, level: LogLevel) {
		this.callback(message + '\n', level, this.tags);
	}

	public debug(message: string) {
		this.log(message, LogLevel.Debug);
	}

	public info(message: string) {
		this.log(message, LogLevel.Info);
	}

	public warn(message: string) {
		this.log(message, LogLevel.Warning);
	}

	public error(message: string) {
		this.log(message, LogLevel.Error);
	}
}
