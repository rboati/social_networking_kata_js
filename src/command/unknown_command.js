import assert from 'assert';
import { ICommand } from './command_interface.js';
import { IConsole } from '../ui/console_interface.js';


export class UnknownCommand extends ICommand {
	execute(userName, ...args) {
	}
}
