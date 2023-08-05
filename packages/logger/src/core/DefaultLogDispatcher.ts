import type { LogDispatcher, LogMessage, LogTransport, Logger, LoggerFactory } from '~/types';

import { DefaultLogger } from './DefaultLogger';

export class DefaultLogDispatcher<TPayload = unknown> implements LogDispatcher<TPayload>, LoggerFactory<TPayload> {
	private readonly _transports = new Set<LogTransport<TPayload>>();
	private isClosing = false;

	public get transports() {
		return this._transports;
	}

	public addTransport(transport: LogTransport<TPayload>) {
		const prevSize = this.transports.size;
		this.transports.add(transport);
		return this._transports.size > prevSize;
	}

	public removeTransport(transport: LogTransport<TPayload>) {
		return this.transports.delete(transport);
	}

	public dispatch(message: LogMessage<TPayload>) {
		if (!this.isClosing) {
			this.transports.forEach(transport => {
				if (transport.minSeverity <= message.severity) {
					transport.handle(message);
				}
			});
		}
	}

	public getLogger(label: string): Logger<TPayload> {
		return new DefaultLogger(label, this, this);
	}

	public async close() {
		this.isClosing = true;
		const results = await Promise.allSettled(
			Array.from(this._transports).map(transport => transport.close())
		);

		const firstRejected = results.find(result => result.status === 'rejected') as PromiseRejectedResult | undefined;
		if (firstRejected) {
			throw firstRejected.reason;
		}
	}
}
