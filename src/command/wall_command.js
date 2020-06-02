import assert from 'assert';
import { ICommand } from './command_interface.js';
import { IClock } from '../time/clock_interface.js';
import { UserDb } from '../data/user_db.js';
import { IConsole } from '../ui/console_interface.js';
import { humanElapsedTime } from '../time/time_utils.js';


export class WallCommand extends ICommand {
	constructor(userDb, clock, con) {
		assert(userDb instanceof UserDb);
		assert(clock instanceof IClock);
		assert(con instanceof IConsole);
		super();
		this.userDb = userDb;
		this.clock = clock;
		this.con = con;
	}

	execute(userName, ...args) {
		const output = this.con.getWritableStream();
		const time = this.clock.currentTime();
		for (const post of this.userDb.wall(userName)) {
			const elapsedTime = humanElapsedTime(new Date(post.timestamp * 1000), new Date(time));
			output.write(`${post.name} - ${post.content} (${elapsedTime})\n`);
		}
	}
}
