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
}