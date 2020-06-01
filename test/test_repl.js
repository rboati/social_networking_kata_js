import chai from 'chai';
const assert = chai.assert;

import { UserDb } from '../src/data/user_db.js';
import { Repl } from '../src/ui/repl.js';
import { DefaultConsole } from '../src/ui/default_console.js';




describe('REPL', function() {
	let con = null;
	let userDb = null;
	let repl = null;


	beforeEach(function() {
		con = new DefaultConsole();
		userDb = new UserDb();
		//repl = new Repl(con);
	});

	afterEach(function() {
		userDb.fini();
		userDb = null;
		con = null;
		repl = null;
	});


	it('should allow the commands post and read', async function() {
		const script = [
			{
				delta: -10*60,
				in: "Alice -> I love the weather today\n",
				out:"> "
			},
			{
				delta: +3*60,
				in: "Bob -> Damn! We lost!\n",
				out:"> "
			},
			{
				delta: +1*60,
				in: "Bob -> Good game though.\n",
				out:"> "
			},
			{
				delta: +1*60,
				in: "Alice\n",
				out:"I love the weather today (5 minutes ago)\n"+
				"> "
			},
			{
				delta: +5,
				in: "Bob\n",
				out:"Good game though. (1 minute ago)\n"+
					"Damn! We lost! (2 minutes ago)\n"+
					"> "
			},
		];

		//repl.mainLoop();
		let time = Date.now();
		for (const event of script) {
			time += (event.delta * 1000);
			const actualOutput = event.in; // TODO
			assert.equal(actualOutput, event.out);
		}
	});

});
