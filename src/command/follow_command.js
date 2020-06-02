import { ICommand } from './command_interface.js';


export class FollowCommand extends ICommand {
	constructor(userDb) {
		super();
		this.userDb = userDb;
	}

	execute(userName, ...args) {
		let userFollowed = args[0];
		this.userDb.follow(userName, userFollowed);
	}
}

