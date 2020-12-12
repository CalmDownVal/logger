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

	public log(level: LogLevel, ...args: any) {
		let str = '';
		for (let i = 0; i < args.length; ++i) {
			str += args[i] + ' ';
		}
		this.callback(str + '\n', level, this.tags);
	}

	public debug(...args: any) {
		this.log(LogLevel.Debug, ...args);
	}

	public info(...args: any) {
		this.log(LogLevel.Info, ...args);
	}

	public warn(...args: any) {
		this.log(LogLevel.Warning, ...args);
	}

	public error(...args: any) {
		this.log(LogLevel.Error, ...args);
	}
}
