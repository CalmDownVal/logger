import { ConsoleTransport } from './Console';

const clearLine = '\u001b[2K';
const clearDown = '\u001b[0J';

function cursorMove(from: number, to: number) {
	const dist = Math.abs(from - to);
	return dist > 0 ? `\u001b[${dist}${from > to ? 'A' : 'B'}` : '';
}

function sanitizeContent(content: any) {
	return ('' + content).replace(/[\r\n]+/g, ' ');
}

export interface ConsoleDockRow {
	content: any;
	delete(): boolean;
}

interface ConsoleDockRowInternal extends ConsoleDockRow {
	isDirty: boolean;
}

export class ConsoleDockTransport extends ConsoleTransport {
	private readonly _rows: ConsoleDockRowInternal[] = [];
	private cursorOffset = 0;
	private dirtyIndex = 0;
	private isPendingUpdate = false;
	private lineBuffer = '';

	public get rows(): readonly ConsoleDockRow[] {
		return this._rows;
	}

	public createRow(insertIndex?: number): ConsoleDockRow {
		let content = '';

		const dock = this;
		const row: ConsoleDockRowInternal = {
			isDirty: true,
			get content() {
				return content;
			},
			set content(value: any) {
				if (content !== (content = sanitizeContent(value))) {
					this.isDirty = true;
					dock.scheduleUpdate();
				}
			},
			delete() {
				return dock.deleteRow(this);
			}
		};

		if (insertIndex === undefined) {
			this._rows.push(row);
		}
		else {
			if (insertIndex < 0 || insertIndex > this._rows.length) {
				throw new RangeError('provided row index is out of bounds');
			}
			this._rows.splice(insertIndex, 0, row);
			this.dirtyIndex = Math.min(this.dirtyIndex, insertIndex);
		}

		this.scheduleUpdate();
		return row;
	}

	public deleteRow(row: ConsoleDockRow) {
		const list = this._rows;

		let index = 0;
		while (index < list.length) {
			if (list[index] === row) {
				list.splice(index, 1);
				break;
			}
			++index;
		}

		if (index === list.length) {
			return false;
		}

		this.dirtyIndex = Math.min(this.dirtyIndex, index);
		this.scheduleUpdate();
		return true;
	}

	public write(str: string) {
		this.lineBuffer += str;
		this.dirtyIndex = 0;
		this.scheduleUpdate();
	}

	private readonly scheduleUpdate = () => {
		if (!this.isPendingUpdate) {
			this.isPendingUpdate = true;
			process.nextTick(this.flush);
		}
	};

	private readonly flush = () => {
		let cmd = '';
		if (this.lineBuffer.length !== 0) {
			cmd += cursorMove(this.cursorOffset, 0) + clearDown +this.lineBuffer;

			this.lineBuffer = '';
			this.cursorOffset = 0;
		}

		const list = this._rows;
		for (let i = 0; i < list.length; ++i) {
			const row = list[i];
			if (row.isDirty || i >= this.dirtyIndex) {
				cmd += cursorMove(this.cursorOffset, i) + clearLine + row.content + '\n';
				this.cursorOffset = i + 1;
				row.isDirty = false;
			}
		}

		cmd += cursorMove(this.cursorOffset, list.length) + clearDown;
		super.write(cmd);

		this.cursorOffset =
		this.dirtyIndex = list.length;
		this.isPendingUpdate = false;
	};
}
