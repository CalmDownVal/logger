export enum LogSeverity {
	Trace = 100,
	Debug = 200,
	Info = 300,
	Warn = 400,
	Error = 500
}

export interface LogMessage<TPayload = unknown> {
	readonly timestamp: number;
	readonly severity: LogSeverity;
	readonly label: string;
	readonly payload: TPayload;
}


export interface Logger<TPayload = unknown> {
	readonly label: string;
	log(severity: LogSeverity, payload: TPayload): void;
	log(severity: LogSeverity, lazyPayload: () => TPayload): void;
	trace(payload: TPayload): void;
	trace(lazyPayload: () => TPayload): void;
	debug(payload: TPayload): void;
	debug(lazyPayload: () => TPayload): void;
	info(payload: TPayload): void;
	info(lazyPayload: () => TPayload): void;
	warn(payload: TPayload): void;
	error(payload: TPayload): void;
}

export interface LoggerFactory<TPayload = unknown> {
	getLogger(label: string): Logger<TPayload>;
}


export interface Closeable {
	close(): Promise<void> | void;
}

export interface LogTransport<TPayload = unknown> extends Closeable {
	minSeverity: LogSeverity;
	handle(message: LogMessage<TPayload>): void;
}

export interface LogDispatcher<TPayload = unknown> extends Closeable {
	readonly transports: Iterable<LogTransport<TPayload>>;
	addTransport(transport: LogTransport<TPayload>): boolean;
	removeTransport(transport: LogTransport<TPayload>): boolean;
	dispatch(message: LogMessage<TPayload>): void;
}


export interface LogFormatter<TOutput = string, TPayload = unknown> {
	format(message: LogMessage<TPayload>): TOutput;
}

export interface TimeProvider {
	now(): number;
}

export interface TimeFormatter {
	format(timestamp: number): string;
}
