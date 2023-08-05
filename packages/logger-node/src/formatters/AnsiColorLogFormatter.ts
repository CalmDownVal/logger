import { IsoTimeFormatter, LogSeverity, type LogFormatter, type LogMessage, type TimeFormatter } from '@cdv/logger';

import { Ansi16, type AnsiColorSystem, type RgbColor } from '~/utils/AnsiColorSystem';

export enum ColorExtent {
	HeaderOnly,
	EntireLine
}

export interface AnsiColorLogFormatterSeverityOptions {
	readonly extent: ColorExtent;
	readonly name: string;
	readonly color: RgbColor;
}

export interface AnsiColorLogFormatterOptions {
	readonly colorSystem?: AnsiColorSystem;
	readonly severities?: Record<LogSeverity, AnsiColorLogFormatterSeverityOptions>;
	readonly timeFormatter?: TimeFormatter;
}

export class AnsiColorLogFormatter implements LogFormatter<string, any> {
	private readonly colorSystem: AnsiColorSystem;
	private readonly severities: Record<LogSeverity, AnsiColorLogFormatterSeverityOptions>;
	private readonly timeFormatter: TimeFormatter;

	public constructor(options: AnsiColorLogFormatterOptions = {}) {
		this.colorSystem = options.colorSystem ?? Ansi16;
		this.severities = options.severities ?? AnsiColorLogFormatter.defaultSeverities;
		this.timeFormatter = options.timeFormatter ?? IsoTimeFormatter.localTimeZone;
	}

	public format(message: LogMessage) {
		const time = this.timeFormatter.format(message.timestamp);
		const severity = this.severities[message.severity];
		const header = `[${time}][${severity.name}][${message.label}]: `;
		switch (severity.extent) {
			case ColorExtent.HeaderOnly:
				return `${this.colorSystem.text(severity.color)}${header}${this.colorSystem.reset}${message.payload}`;

			case ColorExtent.EntireLine:
				return `${this.colorSystem.text(severity.color)}${header}${message.payload}${this.colorSystem.reset}`;
		}
	}

	public static readonly defaultSeverities: Record<LogSeverity, AnsiColorLogFormatterSeverityOptions> = {
		[LogSeverity.Trace]: {
			extent: ColorExtent.HeaderOnly,
			name: 'TRACE',
			color: 0xa0a0a0
		},
		[LogSeverity.Debug]: {
			extent: ColorExtent.HeaderOnly,
			name: 'DEBUG',
			color: 0xa742ff
		},
		[LogSeverity.Info]: {
			extent: ColorExtent.HeaderOnly,
			name: 'INFO',
			color: 0x309fff
		},
		[LogSeverity.Warn]: {
			extent: ColorExtent.HeaderOnly,
			name: 'WARN',
			color: 0xffab2e
		},
		[LogSeverity.Error]: {
			extent: ColorExtent.HeaderOnly,
			name: 'ERROR',
			color: 0xff2e2e
		}
	};
}
