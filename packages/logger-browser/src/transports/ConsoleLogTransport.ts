import { LogSeverity, PlainTextLogFormatter, type LogFormatter, type LogMessage, type LogTransport } from '@cdv/logger';

export interface ConsoleTransportOptions<TPayload = unknown> {
	readonly minSeverity?: LogSeverity;
	readonly formatter?: LogFormatter<string | (readonly string[]), TPayload>;
}

export class ConsoleTransport<TPayload = unknown> implements LogTransport<TPayload> {
	public minSeverity: LogSeverity;
	private readonly formatter: LogFormatter<string | (readonly string[]), TPayload>;

	public constructor(options: ConsoleTransportOptions<TPayload> = {}) {
		this.minSeverity = options.minSeverity ?? LogSeverity.Debug;
		this.formatter = options.formatter ?? new PlainTextLogFormatter();
	}

	public handle(message: LogMessage<TPayload>) {
		let log = this.formatter.format(message);
		if (!Array.isArray(log)) {
			log = [ log as string ];
		}

		/* eslint-disable no-console */
		switch (message.severity) {
			case LogSeverity.Trace:
				console.trace(...log);
				break;

			case LogSeverity.Debug:
				console.debug(...log);
				break;

			case LogSeverity.Info:
				console.info(...log);
				break;

			case LogSeverity.Warn:
				console.warn(...log);
				break;

			case LogSeverity.Error:
				console.error(...log);
				break;
		}
		/* eslint-enable */
	}

	public close() {
		// no-op
	}
}
