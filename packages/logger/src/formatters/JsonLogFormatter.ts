import { IsoTimeFormatter } from '~/formatters/IsoTimeFormatter';
import { LogSeverity, type LogFormatter, type LogMessage, type TimeFormatter } from '~/types';

export interface JsonReplacer {
	(this: any, key: string, value: unknown): unknown;
}

export interface JsonLogFormatterSeverityOptions {
	readonly name: string;
}

export interface JsonLogFormatterOptions {
	readonly jsonReplacer?: JsonReplacer;
	readonly severities?: Record<LogSeverity, JsonLogFormatterSeverityOptions>;
	readonly timeFormatter?: TimeFormatter;
}

export class JsonLogFormatter implements LogFormatter {
	private readonly severities: Record<LogSeverity, JsonLogFormatterSeverityOptions>;
	private readonly timeFormatter: TimeFormatter;
	private readonly jsonReplacer?: JsonReplacer;

	public constructor(options: JsonLogFormatterOptions = {}) {
		this.severities = options.severities ?? JsonLogFormatter.defaultSeverities;
		this.timeFormatter = options.timeFormatter ?? IsoTimeFormatter.localTimeZone;
		this.jsonReplacer = options.jsonReplacer;
	}

	public format(message: LogMessage) {
		const data = {
			timestamp: this.timeFormatter.format(message.timestamp),
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
