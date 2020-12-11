import type { LogFormatter } from '.';
import { LogLevel } from '../LogLevel';

export interface CreateFormatterArgs {
	logLevelMap: Record<LogLevel, string>;
	tagSeparator: string;
	tagsPrefix: string;
	tagsSuffix: string;
}

export function createFormatter(args: CreateFormatterArgs): LogFormatter {
	return (message, level, tags) => {
		const tagCount = tags.length;
		let prefix = args.logLevelMap[level] || '';

		if (tagCount > 0) {
			prefix += args.tagsPrefix;
			for (let i = 0; i < tagCount; ++i) {
				prefix += tags[i] + args.tagSeparator;
			}
			prefix += args.tagsSuffix;
		}

		return prefix + message;
	};
}
