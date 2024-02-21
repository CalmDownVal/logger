import { createDateTimeFormatter } from '~/formatters/DateTimeFormatter';
import type { LogSeverity } from '~/LogSeverity';
import type { LogFormatter, TimeFormatter } from '~/types';
import { toStringOrJson } from '~/utils';

import { defaultMapSeverity } from './internal/defaultMapSeverity';

export interface PlainTextLogFormatterOptions<TPayload> {
	readonly onMapSeverity?: (severity: LogSeverity) => string;
	readonly onStringifyPayload?: (payload: TPayload) => string;
	readonly timeFormatter?: TimeFormatter;
}

export function createPlainTextLogFormatter<TPayload>(
	options: PlainTextLogFormatterOptions<TPayload> = {}
): LogFormatter<TPayload, string> {
	const {
		onMapSeverity = defaultMapSeverity,
		onStringifyPayload = toStringOrJson,
		timeFormatter = createDateTimeFormatter()
	} = options;

	return message => `[${timeFormatter(message.timestamp)}][${onMapSeverity(message.severity)}][${message.label}]: ${onStringifyPayload(message.payload)}`;
}
