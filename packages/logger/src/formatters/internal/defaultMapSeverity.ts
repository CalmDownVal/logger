import { LogSeverity } from '~/LogSeverity';

const KNOWN_SEVERITIES: Record<number, string | undefined> = {
	[LogSeverity.Trace]: 'TRACE',
	[LogSeverity.Debug]: 'DEBUG',
	[LogSeverity.Info]: 'INFO',
	[LogSeverity.Warn]: 'WARN',
	[LogSeverity.Error]: 'ERROR'
};

export function defaultMapSeverity(severity: LogSeverity) {
	return KNOWN_SEVERITIES[severity] ?? `UNKNOWN:${severity}`;
}
