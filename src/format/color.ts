import { createFormatter } from './factory';
import { ANSI256 as c } from '../color';
import { LogLevel } from '../LogLevel';

const gray = c.fg(0x808080);
export const colorFormatter = createFormatter({
	logLevelMap: {
		[LogLevel.Debug]:   ` ${c.fg(0x40ff00)}DEBUG${c.reset} `,
		[LogLevel.Info]:    ` ${c.fg(0x0080ff)}INFO${c.reset}  `,
		[LogLevel.Warning]: ` ${c.fg(0xffff00)}WARN${c.reset}  `,
		[LogLevel.Error]:   ` ${c.fg(0xff0000)}ERROR${c.reset} `
	},
	tagSeparator: `${gray}][${c.reset}`,
	tagsPrefix: `${gray}[${c.reset}`,
	tagsSuffix: `${gray}]${c.reset} `
});
