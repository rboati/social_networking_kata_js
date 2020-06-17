
import { IConsole } from './console_interface.js';

export class DefaultConsole extends IConsole {

	getReadableStream() {
		return process.stdin;
	}

	getWritableStream() {
		return process.stdout;
	}
}