import { LogSeverity, type LogFormatter, type LogMessage } from '~/types';

export interface JsonReplacer {
	(this: any, key: string, value: unknown): unknown;
}

export interface JsonLogFormatterSeverityOptions {
	readonly name: string;
}

export interface JsonLogFormatterOptions {
	readonly jsonReplacer?: JsonReplacer;
	readonly severities?: Record<LogSeverity, JsonLogFormatterSeverityOptions>;
}

export class JsonLogFormatter implements LogFormatter {
	private readonly severities: Record<LogSeverity, JsonLogFormatterSeverityOptions>;
	private readonly jsonReplacer?: JsonReplacer;

	public constructor(options: JsonLogFormatterOptions = {}) {
		this.severities = options.severities ?? JsonLogFormatter.defaultSeverities;
		this.jsonReplacer = options.jsonReplacer;
	}

	public format(message: LogMessage) {
		const data = {
			timestamp: new Date(message.timestamp),
			label: message.label,
			severity: this.severities[message.severity].name,
			payload: message.payload
		};

		return JSON.stringify(data, this.jsonReplacer);
	}

	public static readonly defaultSeverities: Record<LogSeverity, JsonLogFormatterSeverityOptions> = {
		[LogSeverity.Trace]: { name: 'TRACE' },
		[LogSeverity.Debug]: { name: 'DEBUG' },
		[LogSeverity.Info]: { name: 'INFO' },
		[LogSeverity.Warn]: { name: 'WARN' },
		[LogSeverity.Error]: { name: 'ERROR' }
	};
}
