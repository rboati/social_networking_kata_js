import chai from 'chai';
const assert = chai.assert;

import { IClock } from '../src/time/clock_interface.js';
import { humanElapsedTime } from '../src/time/time_utils.js';

class TestClock extends IClock {
	constructor() {
		super();
		this.time = new Date().getTime();
	}

	currentTime() {
		return this.time;
	}
}


describe('Time library', function() {
	let clock = null;

	beforeEach(function() {
		clock = new TestClock();
	});

	afterEach(function() {
		clock = null;
	});


	it('should provide elapsed time in human terms', function() {
		assert.strictEqual(
			humanElapsedTime(new Date(clock.currentTime()), new Date(clock.currentTime())),
			"0 seconds ago"
		);
		assert.strictEqual(
			humanElapsedTime(new Date(clock.currentTime()-1*1000), new Date(clock.currentTime())),
			"1 second ago"
		);
		assert.strictEqual(humanElapsedTime(
			new Date(clock.currentTime()-10*1000), new Date(clock.currentTime())),
			"10 seconds ago"
		);
		assert.strictEqual(humanElapsedTime(
			new Date(clock.currentTime()-1*60*1000), new Date(clock.currentTime())),
			"1 minute ago"
		);
		assert.strictEqual(humanElapsedTime(
			new Date(clock.currentTime()-10*60*1000), new Date(clock.currentTime())),
			"10 minutes ago"
		);
	});

});
