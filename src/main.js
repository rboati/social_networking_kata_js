import { Repl } from './ui/repl.js';
import { DefaultConsole } from './ui/default_console.js';

function main() {
	const con = new DefaultConsole();
	const repl = new Repl(con);
	repl.mainLoop();
}

main();