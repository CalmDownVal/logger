import type { Logger } from '~/types';
import { noop } from '~/utils';

export const NoOpLogger: Logger<any> = {
	label: '',
	getLogger: () => NoOpLogger,
	log: noop,
	trace: noop,
	debug: noop,
	info: noop,
	warn: noop,
	error: noop
};
