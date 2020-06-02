import Database from 'better-sqlite3';

export class UserDb {

	constructor() {
		this.db = null;
		this.init();
	}

	init() {
		this.db = new Database(':memory:');
		let sql=`
			CREATE TABLE user (
				id INTEGER PRIMARY KEY,
				name TEXT NOT NULL UNIQUE
			);

			CREATE TABLE following (
				follower_id INTEGER NOT NULL REFERENCES user(id) ON DELETE CASCADE,
				followed_id INTEGER NOT NULL REFERENCES user(id) ON DELETE CASCADE,
				PRIMARY KEY (follower_id, followed_id)
			) WITHOUT ROWID;

			CREATE TABLE post (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				author_id INTEGER NOT NULL REFERENCES user(id) ON DELETE CASCADE,
				timestamp INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
				content TEXT
			);
		`;
		this.db.exec(sql);
	}

	fini() {
		this.db.close();
		this.db = null;
	}

	reset() {
		let sql = `DELETE FROM user`;
		this.db.exec(sql);
	}

	exists(userName) {
		let sql= `SELECT id FROM user WHERE name=?`;
		let stmt = this.db.prepare(sql);
		let res = stmt.get(userName);
		return !!res;
	}

	add(userName) {
		if (this.exists(userName)) {
			return;
		}
		let sql = `INSERT INTO user (name) VALUES (?)`;
		let stmt = this.db.prepare(sql);
		stmt.run(userName);
	}

	post(userName, message, unixTime) {
		this.add(userName);
		let sql = `INSERT INTO post (author_id, content, timestamp) VALUES ((SELECT id FROM user WHERE name=?), ?, datetime(?, 'unixepoch'))`;
		let stmt = this.db.prepare(sql);
		stmt.run(userName, message, unixTime);
	}

	follow(follower, followed) {
		if (!this.exists(followed)) {
			throw new Error(`User ${followed} doesn't exist`);
		}
		this.add(follower);

		let sql = `INSERT INTO following (follower_id, followed_id) VALUES ((SELECT id FROM user WHERE name=?), (SELECT id FROM user WHERE name=?))`
		let stmt = this.db.prepare(sql);
		stmt.run(follower, followed);
	}

	read(userName) {
		let  sql = `
			SELECT content, strftime('%s',timestamp) timestamp
			FROM post p JOIN user u ON p.author_id = u.id
			WHERE u.name = ?
			ORDER BY p.id DESC
		`;
		let stmt = this.db.prepare(sql);
		return stmt.all(userName);
	}

	wall(userName) {
		let sql = `
			SELECT u.name name, p.content content, strftime('%s',timestamp) timestamp
			FROM post p
				JOIN user u ON p.author_id = u.id
			WHERE u.name = ? OR
				u.id IN (
					SELECT u2.id id
					FROM following f
						JOIN user u1 ON f.follower_id = u1.id
						JOIN user u2 ON f.followed_id = u2.id
					WHERE u1.name = ?
				) ORDER BY p.id DESC
		`;
		let stmt = this.db.prepare(sql);
		return stmt.all(userName, userName);
	}
}