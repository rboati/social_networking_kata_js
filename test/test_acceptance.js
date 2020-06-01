const chai = require('chai');
const assert = chai.assert;

describe('Acceptance test', function() {

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
		let time = Date.now();
		for (const event of script) {
			time += (event.delta * 1000);
			const actualOutput = event.in; // TODO
			assert.equal(actualOutput, event.out);
		}
	});


});
