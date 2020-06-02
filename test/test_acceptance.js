import chai from 'chai';
const assert = chai.assert;

import streamBuffers from 'stream-buffers';
import { EventEmitter, once } from 'events';

import { IConsole } from '../src/ui/console_interface.js';
import { IClock } from '../src/time/clock_interface.js';
import { UserDb } from '../src/data/user_db.js';
import { Repl } from '../src/ui/repl.js';


class myWritableStreamBuffer extends streamBuffers.WritableStreamBuffer {
	constructor(opts) {
		super(opts);
		this.myEmitter = new EventEmitter();
	}

	write(chunk, encoding, callback) {
		super.write(chunk, encoding, callback);
		const stringChunk = chunk.toString();
		if (stringChunk === '> ') {
			this.myEmitter.emit('ready', this.getContentsAsString('utf8'));
		}
	}
}

class TestConsole extends IConsole {
	constructor() {
		super();
		this.input = new streamBuffers.ReadableStreamBuffer({ frequency: 10, chunkSize: 2048 });
		this.output = new myWritableStreamBuffer({ initialSize: (100 * 1024), incrementAmount: (10 * 1024) });
	}

	getReadableStream() {
		return this.input;
	}

	getWritableStream() {
		return this.output;
	}
}

class TestClock extends IClock {
	constructor() {
		super();
		this.time = new Date().getTime();
	}

	currentTime() {
		return this.time;
	}
}





describe('Acceptance test', function() {
	let con = null;
	let userDb = null;
	let clock = null;
	let repl = null;

	beforeEach(function() {
		con = new TestConsole();
		userDb = new UserDb();
		clock = new TestClock();
		repl = new Repl(con);
	});

	afterEach(function() {
		userDb.fini();
		con = null;
		userDb = null;
		clock = null;
		commandFactory = null;
		repl = null;
	});

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
		{
			delta: +5,
			in: "Charlie -> I'm in New York today! Anyone wants to have a coffee?\n",
			out:"> "
		},
		{
			delta: +1,
			in: "Charlie follows Alice\n",
			out:"> "
		},
		{
			delta: +1,
			in: "Charlie wall\n",
			out:"Charlie - I'm in New York today! Anyone wants to have a coffee? (2 seconds ago)\n" +
				"Alice - I love the weather today (5 minutes ago)\n"+
				"> "
		},
		{
			delta: +3,
			in: "Charlie follows Bob\n",
			out:"> "
		},
		{
			delta: +10,
			in: "Charlie wall\n",
			out:"Charlie - I'm in New York today! Anyone wants to have a coffee? (15 seconds ago)\n" +
				"Bob - Good game though. (1 minute ago)\n" +
				"Bob - Damn! We lost! (2 minutes ago)\n" +
				"Alice - I love the weather today (5 minutes ago)\n"+
				"> "
		},
	];


	it('should match every event', async function() {
		repl.mainLoop();
		for (const event of script) {
			clock.time += (event.delta * 1000);
			con.input.put(event.in);
			const [ actualOutput ] = await once(con.output.myEmitter, 'ready');
			//console.log("-- expected --");
			//console.log("\x1b[36m%s\x1b[0m", event.out);
			//console.log("--- actual ---");
			//console.log("\x1b[1m%s\x1b[0m", event.out);
			//console.log("--------------");
			assert.equal(actualOutput, event.out);
		}
	});


});
