import fp from 'fastify-plugin';
import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';

export interface User {
	id: string;
	email: string;
	password: string;
	is2FAEnabled: boolean;
	twoFASecret?: string;
	created_at: string;
	updated_at: string;
}

export default fp(async (fastify, opts) => {

	const db = new Database('./transcendence.db', { verbose: console.log });
	db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      is2FAEnabled INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

	fastify.decorate('db', db);

	fastify.decorate('getUserByEmail', async (email: string): Promise<User | null> => {
		const stmt = db.prepare(`
      SELECT id, email, password, is2FAEnabled, created_at, updated_at
      FROM users
      WHERE email = ?
    `);
		const row = stmt.get(email);
		return (row as User) || null;
	});

	fastify.decorate('addUser', async (email: string, password: string) => {
		try {
			const hash = await bcrypt.hash(password, 10);
			const stmt = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)");
			const info = stmt.run(email, hash);
			return info.changes === 1;
		} catch (err: any) {
			if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
				return false;
			}
			throw err;
		}
	});

	fastify.addHook('onClose', (instance, done) => {
		db.close();
		done();
	});

	fastify.log.info('Connected to database.');
});
