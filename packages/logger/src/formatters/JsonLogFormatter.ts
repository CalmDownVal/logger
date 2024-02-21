import type { LogSeverity } from '~/LogSeverity';
import type { LogFormatter } from '~/types';

import { defaultMapSeverity } from './internal/defaultMapSeverity';

export interface JsonReplacer {
	(this: any, key: string, value: any): any;
}

export interface JsonLogFormatterOptions {
	readonly onReplaceJson?: JsonReplacer;
	readonly onMapSeverity?: (severity: LogSeverity) => any;
}

export function createJsonLogFormatter(options: JsonLogFormatterOptions = {}): LogFormatter<any, string> {
	const {
		onReplaceJson,
		onMapSeverity = defaultMapSeverity
	} = options;

	return message => JSON.stringify(
		{
			timestamp: new Date(message.timestamp),
			label: message.label,
			severity: onMapSeverity(message.severity),
			payload: message.payload
		},
		onReplaceJson
	);
}
