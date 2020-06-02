import assert from 'assert';
import { ICommand } from './command_interface.js';
import { IClock } from '../time/clock_interface.js';
import { UserDb } from '../data/user_db.js';


export class PostCommand extends ICommand {
	constructor(userDb, clock) {
		assert(userDb instanceof UserDb);
		assert(clock instanceof IClock);
		super();
		this.userDb = userDb;
		this.clock = clock;
	}

	execute(userName, ...args) {
		const message = args[0];
		const time = this.clock.currentTime();
		this.userDb.post(userName, message, Math.floor(time / 1000));
	}
}
