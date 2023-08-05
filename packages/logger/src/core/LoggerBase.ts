import { LogSeverity, type Logger } from '~/types';

export abstract class LoggerBase<TPayload = unknown> implements Logger<TPayload> {
	public abstract readonly label: string;

	public abstract log(severity: LogSeverity, payload: TPayload | (() => TPayload)): void;

	public trace(payload: TPayload | (() => TPayload)) {
		this.log(LogSeverity.Trace, payload);
	}

	public debug(payload: TPayload | (() => TPayload)) {
		this.log(LogSeverity.Debug, payload);
	}

	public info(payload: TPayload | (() => TPayload)) {
		this.log(LogSeverity.Info, payload);
	}

	public warn(payload: TPayload) {
		this.log(LogSeverity.Warn, payload);
	}

	public error(payload: TPayload) {
		this.log(LogSeverity.Error, payload);
	}
}
