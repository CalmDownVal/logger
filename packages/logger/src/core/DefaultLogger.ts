import type { LogDispatcher, LogMessage, LogSeverity, Logger, LoggerFactory, TimeProvider } from '~/types';
import { joinLabels } from '~/utils/internal';

import { LoggerBase } from './LoggerBase';

export class DefaultLogger<TPayload = unknown> extends LoggerBase<TPayload> implements LoggerFactory<TPayload> {
	public constructor(
		public readonly label: string,
		public readonly dispatcher: LogDispatcher<TPayload>,
		public readonly factory: LoggerFactory<TPayload>,
		public readonly timeProvider: TimeProvider = Date
	) {
		super();
	}

	public log(severity: LogSeverity, payload: TPayload | (() => TPayload)) {
		const message = {
			severity,
			label: this.label,
			timestamp: this.timeProvider.now()
		} as LogMessageInternals<TPayload>;

		if (typeof payload === 'function') {
			message.payloadFactory = payload as (() => TPayload);
		}
		else {
			message.payloadValue = payload;
		}

		Object.defineProperty(message, 'payload', {
			enumerable: true,
			configurable: false,
			get: payloadGetter
		});

		this.dispatcher.dispatch(message);
	}

	public getLogger(label: string): Logger {
		return this.factory.getLogger(joinLabels(this.label, label));
	}
}

interface LogMessageInternals<T> extends LogMessage<T> {
	payloadValue?: T;
	payloadFactory?: () => T;
}

function payloadGetter<T>(this: LogMessageInternals<T>): T {
	return (this.payloadValue ??= this.payloadFactory!());
}
