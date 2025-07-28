import fp from 'fastify-plugin';
import Database from 'better-sqlite3';
import { getUserByEmail, getUserByID, addUser, updateUser, update2FASecret, update2FAEnabled } from './users';
import { addGameResult, getResultsByUserID } from './gameresult';

export const db = new Database('./transcendence.db', { verbose: console.log });

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	profilepicture TEXT,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	is2FAEnabled INTEGER DEFAULT 0,
	twoFASecret TEXT,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS chats (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	message TEXT NOT NULL,
	user_id INTEGER,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(user_id) REFERENCES users(id)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS friends (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id INTEGER,
	friend_id INTEGER,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(user_id) REFERENCES users(id),
	FOREIGN KEY(friend_id) REFERENCES users(id)
  );
`)

export default fp(async (fastify, opts) => {

	fastify.decorate('db', db);

	fastify.decorate('getUserByEmail', getUserByEmail);
	fastify.decorate('getUserByID', getUserByID);
	fastify.decorate('addUser', addUser);
	fastify.decorate('updateUser', updateUser);
	fastify.decorate('update2FASecret', update2FASecret);
	fastify.decorate('update2FAEnabled', update2FAEnabled);
	fastify.decorate('getResultsByUserID', getResultsByUserID);
	fastify.decorate('addGameResult', addGameResult);


	fastify.addHook('onClose', (instance, done) => {
		db.close();
		done();
	});

	fastify.log.info('Connected to database.');
});