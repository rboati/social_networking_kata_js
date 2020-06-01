
import readline from 'readline';
import assert from 'assert';
import { IConsole } from './console_interface.js';


export class Repl {
	constructor(con) {
		assert(con instanceof IConsole);
		this.rl = readline.createInterface({
			input: con.getReadableStream(),
			output: con.getWritableStream(),
			prompt: '> ',
			removeHistoryDuplicates: true,
		  });
	}

	mainLoop() {
		this.rl.prompt();
		this.rl.on('line', (line) => {
			line = line.trim();
			if (line === '') {
				this.rl.prompt();
				return;
			}
			const matches = line.matchAll(/(\S+)/g);
			let match, userToken='', commandToken='', arg='';
			match = matches.next();
			userToken = match.value ? match.value[0] : '';
			if (userToken) {
				match = matches.next();
				commandToken = match.value ? match.value[0] : '';
				if (commandToken) {
					match = matches.next();
					arg = line.slice(match.value ? match.value.index : -1);
				}
			}

			console.log(commandToken);

			this.rl.prompt();
		});
	}
}