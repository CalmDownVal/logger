import type { Logger } from './Logger';
import { LogLevel } from './LogLevel';
import { ProxyLogger } from './ProxyLogger';
import type { Transport } from './transport';

export interface LoggerOptions {
	level?: LogLevel;
	tags?: readonly string[];
	transports?: readonly Transport[];
}

export class MasterLogger extends ProxyLogger implements Logger {
	public level: LogLevel;

	private readonly transports: Transport[];

	public constructor(options: LoggerOptions = {}) {
		super((logMessage, logLevel, logTags) => {
			if (this.level === undefined || logLevel >= this.level) {
				const list = this.transports;
				for (let i = 0; i < list.length; ++i) {
					list[i].log(logMessage, logLevel, logTags);
				}
			}
		}, options.tags);

		this.level = options.level ?? LogLevel.Debug;
		this.transports = options.transports?.slice() || [];
	}

	public addTransport(transport: Transport) {
		this.transports.push(transport);
	}

	public removeTransport(transport: Transport) {
		const index = this.transports.indexOf(transport);
		if (index !== -1) {
			this.transports.splice(index, 1);
			return true;
		}
		return false;
	}
}
