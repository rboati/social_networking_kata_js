import assert from 'assert';

import { ICommandFactory } from './command_factory_interface.js'
import { ICommand } from './command_interface.js';
import { IClock } from '../time/clock_interface.js';
import { IConsole } from '../ui/console_interface.js';
import { UserDb } from '../data/user_db.js';

import { UnknownCommand } from './unknown_command.js';
import { PostCommand } from './post_command.js';
import { FollowCommand } from './follow_command.js';
import { ReadCommand } from './read_command.js';
import { WallCommand } from './wall_command.js';

export class DefaultCommandFactory extends ICommandFactory{
	constructor(userDb, clock, con) {
		assert(userDb instanceof UserDb);
		assert(clock instanceof IClock);
		assert(con instanceof IConsole);
		super();
		this.userDb = userDb;
		this.clock = clock;
		this.con = con;

		this.commands = {}
		this.unknownCommand = new UnknownCommand();
		this.addCommand('->', new PostCommand(userDb, clock));
		this.addCommand('follows', new FollowCommand(userDb));
		this.addCommand('', new ReadCommand(userDb, clock, con));
		this.addCommand('wall', new WallCommand(userDb, clock, con));
	}

	addCommand(token, command) {
		assert(command instanceof ICommand);
		this.commands[token] = command;
	}

	getCommand(token) {
		const command = this.commands[token]
		return command ? command : this.unknownCommand;
	}
}
