import { createFormatter } from './factory';
import { LogLevel } from '../LogLevel';

export const defaultFormatter = createFormatter({
	logLevelMap: {
		[LogLevel.Debug]:   'DEBUG ',
		[LogLevel.Info]:    'INFO ',
		[LogLevel.Warning]: 'WARN ',
		[LogLevel.Error]:   'ERROR '
	},
	tagSeparator: '][',
	tagsPrefix: '[',
	tagsSuffix: '] '
});
