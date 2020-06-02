import { Repl } from './ui/repl.js';
import { DefaultConsole } from './ui/default_console.js';
import { DefaultCommandFactory } from './command/default_command_factory.js';
import { DefaultClock } from './time/default_clock.js';
import { UserDb } from './data/user_db.js';

function main() {
	const con = new DefaultConsole();
	const userDb = new UserDb();
	const clock = new DefaultClock();
	const commandFactory = new DefaultCommandFactory(userDb, clock, con);
	const repl = new Repl(con, commandFactory);
	repl.mainLoop();
}

main();