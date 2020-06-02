import { Repl } from './ui/repl.js';
import { DefaultConsole } from './ui/default_console.js';
import { DefaultClock } from './time/default_clock.js';
import { UserDb } from './data/user_db.js';

function main() {
	const con = new DefaultConsole();
	const repl = new Repl(con);
	repl.mainLoop();
}

main();