import type { LogLevel } from '../LogLevel';

export interface LogFormatter {
	(message: string, level: LogLevel, tags: readonly string[]): string;
}

export * from './factory';
export * from './color';
export * from './default';
