import { createWriteStream, type PathLike } from 'node:fs';
import type { Writable } from 'node:stream';

import { LogSeverity, PlainTextLogFormatter, type LogFormatter, type LogMessage, type LogTransport } from '@cdv/logger';

export type WritableData = Buffer | Uint8Array | string;

export interface WritableLogTransportOptions<TPayload = unknown> {
	readonly closeStream?: boolean;
	readonly formatter?: LogFormatter<WritableData, TPayload>;
	readonly minSeverity?: LogSeverity;
	readonly writable: Writable;
}

export interface CreateFileOptions<TPayload = unknown> extends Omit<WritableLogTransportOptions<TPayload>, 'writable'> {
	readonly path: PathLike;
}

export interface CreateStdOutOptions<TPayload = unknown> extends Omit<WritableLogTransportOptions<TPayload>, 'writable'> {
	readonly minSeverity: LogSeverity;
}

export class WritableLogTransport<TPayload = unknown> implements LogTransport<TPayload> {
	public minSeverity: LogSeverity;

	private readonly closeStream: boolean;
	private readonly formatter: LogFormatter<WritableData, TPayload>;
	private readonly writable: Writable;

	public constructor(options: WritableLogTransportOptions<TPayload>) {
		this.minSeverity = options.minSeverity ?? LogSeverity.Debug;
		this.closeStream = options.closeStream ?? (options.writable !== process.stdout && options.writable !== process.stderr);
		this.formatter = options.formatter ?? new PlainTextLogFormatter();
		this.writable = options.writable;
	}

	public handle(message: LogMessage<TPayload>) {
		if (!this.writable.errored) {
			const log = this.formatter.format(message);

			// We ignore the return value of write, because buffering and overflow
			// handling is already implemented in Node's streams
			this.writable.write(log);
			this.writable.write('\n');
		}
	}

	public close() {
		if (!this.closeStream) {
			return Promise.resolve();
		}

		return new Promise<void>(resolve => {
			this.writable.end(resolve);
		});
	}

	public static createFile<TPayload = unknown>(options: CreateFileOptions<TPayload>) {
		return new WritableLogTransport({
			...options,
			writable: createWriteStream(options.path)
		});
	}

	public static createStdout<TPayload = unknown>(options: CreateStdOutOptions<TPayload>) {
		return new WritableLogTransport({
			...options,
			writable: process.stdout
		});
	}
}
