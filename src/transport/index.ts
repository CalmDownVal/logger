import type { LogLevel } from '../LogLevel';

export interface Transport {
	log(message: string, level: LogLevel, tags: readonly string[]): void;
}

export * from './Base';
export * from './Console';
export * from './ConsoleDock';
