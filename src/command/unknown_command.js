import { ICommand } from './command_interface.js';

export class UnknownCommand extends ICommand {
	execute(userName, ...args) {
	}
}
