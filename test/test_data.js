import chai from 'chai';
const assert = chai.assert;

import { UserDb } from '../src/data/user_db.js';


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
		userDb.post('Alice', "I love the weather today", Math.floor(Date.now()/1000));
		assert.isTrue(userDb.exists('Alice'));
		let sql = `SELECT count(*) count, p.content content FROM post p JOIN user u ON p.author_id = u.id WHERE u.name='Alice'`;
		let stmt = userDb.db.prepare(sql);
		let res = stmt.get();
		assert.strictEqual(res.count, 1);
		assert.strictEqual(res.content, "I love the weather today");
	});

});
