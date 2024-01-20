import { IsoTimeFormatter } from '~/formatters/IsoTimeFormatter';
import { LogSeverity, type LogFormatter, type LogMessage, type TimeFormatter } from '~/types';
import { toStringOrJson } from '~/utils/shared';

export interface PlainTextLogFormatterSeverityOptions {
	readonly name: string;
}

export interface PlainTextLogFormatterOptions {
	readonly severities?: Record<LogSeverity, PlainTextLogFormatterSeverityOptions>;
	readonly timeFormatter?: TimeFormatter;
}

export class PlainTextLogFormatter implements LogFormatter<string, any> {
	private readonly severities: Record<LogSeverity, PlainTextLogFormatterSeverityOptions>;
	private readonly timeFormatter: TimeFormatter;

	public constructor(options: PlainTextLogFormatterOptions = {}) {
		this.severities = options.severities ?? PlainTextLogFormatter.defaultSeverities;
		this.timeFormatter = options.timeFormatter ?? IsoTimeFormatter.localTimeZone;
	}

	public format(message: LogMessage) {
		const time = this.timeFormatter.format(message.timestamp);
		const severity = this.severities[message.severity].name;
		return `[${time}][${severity}][${message.label}]: ${toStringOrJson(message.payload)}`;
	}

	public static readonly defaultSeverities: Record<LogSeverity, PlainTextLogFormatterSeverityOptions> = {
		[LogSeverity.Trace]: { name: 'TRACE' },
		[LogSeverity.Debug]: { name: 'DEBUG' },
		[LogSeverity.Info]: { name: 'INFO' },
		[LogSeverity.Warn]: { name: 'WARN' },
		[LogSeverity.Error]: { name: 'ERROR' }
	};
}
