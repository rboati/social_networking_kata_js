import chai from 'chai';
const assert = chai.assert;

import { UserDb } from '../src/data/user_db.js';
import { IClock } from '../src/time/clock_interface.js';

class TestClock extends IClock {
	constructor() {
		super();
		this.time = new Date().getTime();
	}

	currentTime() {
		return this.time;
	}
}

const clock = new TestClock();




describe('User DB', function() {
	let userDb = null;

	beforeEach(function() {
		userDb = new UserDb();
	});

	afterEach(function() {
		userDb.fini();
		userDb = null;
	});


	it('should add a user', function() {
		assert.isFalse(userDb.exists('Alice'));
		userDb.add('Alice');
		assert.isTrue(userDb.exists('Alice'));
	});

	it('should post', function() {
		assert.isFalse(userDb.exists('Alice'));
		userDb.post('Alice', "I love the weather today", Math.floor(clock.currentTime() /1000));
		assert.isTrue(userDb.exists('Alice'));
		let sql = `SELECT count(*) count, p.content content FROM post p JOIN user u ON p.author_id = u.id WHERE u.name='Alice'`;
		let stmt = userDb.db.prepare(sql);
		let res = stmt.get();
		assert.strictEqual(res.count, 1);
		assert.strictEqual(res.content, "I love the weather today");
	});

	it('should follow', function() {
		assert.isFalse(userDb.exists('Alice'));
		assert.isFalse(userDb.exists('Bob'));
		assert.Throw(function() {
			userDb.follow('Alice', 'Bob');
		});
		assert.isFalse(userDb.exists('Alice'));
		assert.isFalse(userDb.exists('Bob'));
		userDb.add('Alice');
		userDb.add('Bob');
		userDb.follow('Alice', 'Bob');

		let sql = `SELECT count(*) count FROM following f JOIN user u1 ON f.follower_id = u1.id JOIN user u2 ON f.followed_id = u2.id WHERE u1.name='Alice'`;
		let stmt = userDb.db.prepare(sql);
		let res = stmt.get();
		assert.strictEqual(res.count, 1);

		sql = `SELECT u2.name FROM following f JOIN user u1 ON f.follower_id = u1.id JOIN user u2 ON f.followed_id = u2.id WHERE u1.name='Alice'`;
		stmt = userDb.db.prepare(sql);
		res = stmt.get();
		assert.strictEqual(res.name, 'Bob');

		sql = `SELECT count(*) count FROM following f JOIN user u1 ON f.follower_id = u1.id JOIN user u2 ON f.followed_id = u2.id WHERE u2.name='Bob'`;
		stmt = userDb.db.prepare(sql);
		res = stmt.get();
		assert.strictEqual(res.count, 1);

		sql = `SELECT u1.name FROM following f JOIN user u1 ON f.follower_id = u1.id JOIN user u2 ON f.followed_id = u2.id WHERE u2.name='Bob'`;
		stmt = userDb.db.prepare(sql);
		res = stmt.get();
		assert.strictEqual(res.name, 'Alice');

	});

});
