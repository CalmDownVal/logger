import type { LogSeverity } from './LogSeverity';

export interface TimeProvider {
	now(): number;
}

export type NotLazy<T> = T extends (...a: any) => any ? never : T;
export type Lazy<T> = () => T;

export interface RawLogCallback<TPayload> {
	(severity: LogSeverity, payload: NotLazy<TPayload>): void;
	(severity: LogSeverity, lazyPayload: Lazy<TPayload>): void;

	/** @internal */
	(severity: LogSeverity, anyPayload: NotLazy<TPayload> | Lazy<TPayload>): void;
}

export interface LogCallback<TPayload> {
	(payload: NotLazy<TPayload>): void;
	(lazyPayload: Lazy<TPayload>): void;

	/** @internal */
	(anyPayload: NotLazy<TPayload> | Lazy<TPayload>): void;
}

export interface Logger<TPayload> {
	readonly label: string;
	readonly getLogger: LoggerFactory<TPayload>;

	readonly log: RawLogCallback<TPayload>;
	readonly trace: LogCallback<TPayload>;
	readonly debug: LogCallback<TPayload>;
	readonly info: LogCallback<TPayload>;
	readonly warn: LogCallback<TPayload>;
	readonly error: LogCallback<TPayload>;
}

export interface LoggerFactory<TPayload> {
	(label: string): Logger<TPayload>;
}

export interface Closeable {
	close(): Promise<void> | void;
}

export interface LogMessage<TPayload> {
	readonly timestamp: number;
	readonly severity: LogSeverity;
	readonly label: string;
	readonly payload: TPayload;
}

export interface LogFormatter<TPayload, TOutput> {
	(message: LogMessage<TPayload>): TOutput;
}

export interface LogTransport<TPayload, TOutput> extends Closeable {
	formatter: LogFormatter<TPayload, TOutput>;
	minSeverity: LogSeverity;
	handle(message: LogMessage<TPayload>): void;
}

export interface LogTransportAddCallback<TPayload> {
	(transport: LogTransport<TPayload, any>): boolean;
}

export interface LogTransportRemoveCallback<TPayload> {
	(transport: LogTransport<TPayload, any>): boolean;
}

export interface LogTransportCollection<TPayload> extends Iterable<LogTransport<TPayload, any>> {
	readonly add: LogTransportAddCallback<TPayload>;
	readonly remove: LogTransportRemoveCallback<TPayload>;
}

export interface LogDispatcher<TPayload> extends Closeable {
	readonly transports: LogTransportCollection<TPayload>;
	readonly getLogger: LoggerFactory<TPayload>;

	/** @internal */
	$dispatch(message: LogMessage<TPayload>): void;
}

export interface TimeFormatter {
	(timestamp: number): string;
}
