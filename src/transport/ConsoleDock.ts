import { ConsoleTransport } from './Console';

const clearLine = '\u001b[2K';
const clearDown = '\u001b[0J';

function cursorMove(from: number, to: number) {
	const dist = Math.abs(from - to);
	return dist > 0 ? `\u001b[${dist}${from > to ? 'A' : 'B'}` : '';
}

function sanitizeLF(content: string) {
	return content.replace(/[\r\n]+/g, ' ');
}

interface DockRow {
	content: string;
	isDirty: boolean;
	isWritten: boolean;
}

export class ConsoleDockTransport extends ConsoleTransport {
	private readonly dockRows: DockRow[] = [];
	private cursorOffset = 0;
	private isPendingUpdate = false;
	private lineBuffer = '';

	public get dockSize() {
		return this.dockRows.length;
	}

	public addRows(count: number) {
		for (let i = 0; i < count; ++i) {
			this.dockRows.push(this.createRow());
		}

		this.scheduleUpdate();
	}

	public removeRows(count: number) {
		if (count > this.dockRows.length) {
			throw new RangeError('requested removal of more rows than currently present');
		}

		this.dockRows.splice(this.dockRows.length - count, count);
		this.scheduleUpdate();
	}

	public insertRowAt(index: number) {
		if (index === this.dockRows.length) {
			this.addRows(1);
			return;
		}

		this.assertRowIndex(index);
		this.dockRows.splice(index, 0, this.createRow());
		this.scheduleUpdate();
	}

	public removeRowAt(index: number) {
		this.assertRowIndex(index);
		this.dockRows.splice(index, 1);
		this.scheduleUpdate();
	}

	public setRow(index: number, content: string) {
		this.assertRowIndex(index);

		const row = this.dockRows[index];
		row.content = sanitizeLF(content);
		row.isDirty = true;
		this.scheduleUpdate();
	}

	public write(str: string) {
		this.lineBuffer += str;
		this.scheduleUpdate();
	}

	private assertRowIndex(index: number) {
		if (index < 0 || index >= this.dockRows.length) {
			throw new RangeError('provided row index is out of bounds');
		}
	}

	private createRow() {
		return {
			content: '',
			isDirty: true,
			isWritten: false,
		};
	}

	private scheduleUpdate() {
		if (!this.isPendingUpdate) {
			this.isPendingUpdate = true;
			process.nextTick(this.flush);
		}
	}

	private readonly flush = () => {
		let cmd = '';
		let forceUpdate = false;

		if (this.lineBuffer.length !== 0) {
			cmd += cursorMove(this.cursorOffset, 0) + clearDown +this.lineBuffer;

			this.lineBuffer = '';
			this.cursorOffset = 0;
			forceUpdate = true;
		}

		const length = this.dockRows.length;
		for (let i = 0; i < length; ++i) {
			const row = this.dockRows[i];
			if (forceUpdate || row.isDirty) {
				cmd += cursorMove(this.cursorOffset, i) + clearLine + row.content + '\n';
				this.cursorOffset = i + 1;

				if (!row.isWritten) {
					row.isWritten = true;
					forceUpdate = true;
				}
			}
		}

		cmd += cursorMove(this.cursorOffset, length);
		super.write(cmd);

		this.cursorOffset = length;
		this.isPendingUpdate = false;
	};
}
