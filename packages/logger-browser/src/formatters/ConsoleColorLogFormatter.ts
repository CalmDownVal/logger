import { IsoTimeFormatter, LogSeverity, type LogFormatter, type LogMessage, type TimeFormatter } from '@cdv/logger';

export enum StyleExtent {
	HeaderOnly,
	EntireLine
}

export interface ConsoleColorLogFormatterSeverityOptions {
	readonly extent: StyleExtent;
	readonly style: string;
}

export interface ConsoleColorLogFormatterOptions {
	readonly severities?: Record<LogSeverity, ConsoleColorLogFormatterSeverityOptions>;
	readonly timeFormatter?: TimeFormatter;
}

export class ConsoleColorLogFormatter implements LogFormatter<readonly string[], string> {
	private readonly severities: Record<LogSeverity, ConsoleColorLogFormatterSeverityOptions>;
	private readonly timeFormatter: TimeFormatter;

	public constructor(options: ConsoleColorLogFormatterOptions) {
		this.severities = options.severities ?? ConsoleColorLogFormatter.defaultSeverities;
		this.timeFormatter = options.timeFormatter ?? IsoTimeFormatter.localTimeZone;
	}

	public format(message: LogMessage<string>) {
		const time = this.timeFormatter.format(message.timestamp);
		const severity = this.severities[message.severity];

		// This formatter is meant to be used with ConsoleTransport which handles
		// severity on its own, therefore we don't need to include it in the header.
		const header = `[${time}][${message.label}]: `;
		switch (severity.extent) {
			case StyleExtent.HeaderOnly:
				return [ `%c${header}%c${message.payload}`, severity.style, '' ];

			case StyleExtent.EntireLine:
				return [ `%c${header}${message.payload}`, severity.style ];
		}
	}

	public static readonly defaultSeverities: Record<LogSeverity, ConsoleColorLogFormatterSeverityOptions> = {
		[LogSeverity.Trace]: {
			extent: StyleExtent.HeaderOnly,
			style: 'color:#a0a0a0'
		},
		[LogSeverity.Debug]: {
			extent: StyleExtent.HeaderOnly,
			style: 'color:#a742ff'
		},
		[LogSeverity.Info]: {
			extent: StyleExtent.HeaderOnly,
			style: 'color:#309fff'
		},
		[LogSeverity.Warn]: {
			extent: StyleExtent.HeaderOnly,
			style: 'color:#ffab2e'
		},
		[LogSeverity.Error]: {
			extent: StyleExtent.HeaderOnly,
			style: 'color:#ff2e2e'
		}
	};
}
