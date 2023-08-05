import type { Logger, LoggerFactory } from '~/types';
import { joinLabels } from '~/utils/misc';

import { LoggerBase } from './LoggerBase';

export class NoOpLogger<TPayload = unknown> extends LoggerBase<TPayload> implements LoggerFactory<TPayload> {
	public constructor(
		public readonly label: string
	) {
		super();
	}

	public log() {
		// no-op
	}

	public getLogger(label: string): Logger<TPayload> {
		return new NoOpLogger(joinLabels(this.label, label));
	}
}
