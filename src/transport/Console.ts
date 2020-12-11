import { TransportBase } from './Base';

export class ConsoleTransport extends TransportBase {
	public write(str: string) {
		process.stdout.write(str);
	}
}
