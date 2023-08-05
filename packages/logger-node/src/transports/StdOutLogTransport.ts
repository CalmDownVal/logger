import { LogSeverity, PlainTextLogFormatter, type LogFormatter, type LogMessage, type LogTransport } from '@cdv/logger';

export interface StdOutLogTransportOptions<TPayload = unknown> {
	readonly dockGap?: number;
	readonly formatter?: LogFormatter<string, TPayload>;
	readonly minSeverity?: LogSeverity;
	readonly trimMargin?: number;
}

export interface DockedRow {
	/** @internal */
	isDirty: boolean;
	content: string;
}

export class StdOutLogTransport<TPayload = unknown> implements LogTransport<TPayload> {
	public minSeverity: LogSeverity;

	private readonly formatter: LogFormatter<string, TPayload>;
	private readonly rows: DockedRow[] = [];
	private readonly dockGap: number;
	private readonly trimMargin: number;
	private cursor: number;
	private dirtyIndex = 0;
	private isPendingUpdate = false;
	private lineBuffer = '';

	public constructor(options: StdOutLogTransportOptions = {}) {
		this.minSeverity = options.minSeverity ?? LogSeverity.Debug;
		this.formatter = options.formatter ?? new PlainTextLogFormatter();
		this.dockGap = Math.max(options.dockGap ?? 1, 0);
		this.trimMargin = Math.max(options.trimMargin ?? 5, 0);
		this.cursor = -this.dockGap;

		process.on('SIGWINCH', this.onResize);
	}

	public handle(message: LogMessage<TPayload>): void {
		const log = this.formatter.format(message) + '\n';
		if (!this.isPendingUpdate && this.rows.length === 0) {
			process.stdout.write(log);
		}
		else {
			this.lineBuffer += log;
			this.scheduleUpdate();
		}
	}

	public close() {
		process.off('SIGWINCH', this.onResize);
	}


	public get dockedRows(): readonly DockedRow[] {
		return this.rows;
	}

	public addDockedRow(initialContent = ''): DockedRow {
		let content = initialContent;

		const { scheduleUpdate } = this;
		const row: DockedRow = {
			isDirty: true,
			get content() {
				return content;
			},
			set content(value) {
				if (content !== (content = sanitizeContent(value))) {
					this.isDirty = true;
					scheduleUpdate();
				}
			}
		};

		this.rows.push(row);
		this.scheduleUpdate();
		return row;
	}

	public removeDockedRow(row: DockedRow) {
		const index = this.rows.indexOf(row);
		if (index === -1) {
			return false;
		}

		this.rows.splice(index, 1);
		this.dirtyIndex = Math.min(this.dirtyIndex, index);
		this.scheduleUpdate();
		return true;
	}

	public clearDockedRows() {
		if (this.rows.length !== 0) {
			this.rows.splice(0, this.rows.length);
			this.dirtyIndex = 0;
			this.scheduleUpdate();
		}
	}

	private readonly scheduleUpdate = () => {
		if (!this.isPendingUpdate) {
			this.isPendingUpdate = true;
			process.nextTick(this.onUpdate);
		}
	};

	private readonly onResize = () => {
		this.dirtyIndex = 0;
		this.scheduleUpdate();
	};

	private readonly onUpdate = () => {
		const rowCount = this.rows.length;
		const maxLength = process.stdout.columns - this.trimMargin;

		let cmd = '';
		let clearDown = '\u001b[0J';
		let clearLine = '\u001b[2K';

		if (this.lineBuffer.length > 0) {
			cmd += cursorMove(-this.cursor - this.dockGap) + '\r' + clearDown + this.lineBuffer;
			this.lineBuffer = '';
			this.dirtyIndex = 0;

			this.cursor = -this.dockGap;
			clearDown = '';
			clearLine = '';
		}

		for (let i = 0; i < rowCount; ++i) {
			const row = this.rows[i];
			if (row.isDirty || i >= this.dirtyIndex) {
				cmd += cursorMove(i - this.cursor) + '\r' + clearLine + trimContent(row.content, maxLength) + '\n';
				row.isDirty = false;

				this.cursor = i + 1;
			}
		}

		cmd += cursorMove(rowCount - this.cursor) + clearDown;
		process.stdout.write(cmd, 'utf8');

		this.cursor = rowCount;
		this.dirtyIndex = rowCount;
		this.isPendingUpdate = false;
	};
}

function cursorMove(offset: number) {
	const dist = Math.trunc(Math.abs(offset));
	return dist > 0 ? `\u001b[${dist}${offset < 0 ? 'A' : 'B'}` : '';
}

function sanitizeContent(content: string) {
	return ('' + content).replace(/[\r\n]+/g, ' ');
}

function trimContent(content: string, maxLength: number) {
	let index = 0;
	let count = 0;

	while (index < content.length && count < maxLength) {
		if (isSurrogatePairAt(content, index)) {
			index += 2;
		}
		else {
			++index;
		}

		++count;
	}

	return content.slice(0, index);
}

function isSurrogatePairAt(content: string, index: number) {
	return (
		(content.charCodeAt(index) & 0xFC00) === 0xD800 &&
		(content.charCodeAt(index + 1) & 0xFC00) === 0xDC00
	);
}
