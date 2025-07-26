import fp from 'fastify-plugin';
import Database from 'better-sqlite3';
import { getUserByEmail, getUserByID, addUser, updateUser } from './users/users';

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
  CREATE TABLE IF NOT EXISTS game_results (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	player1 TEXT NOT NULL,
	player2 TEXT NOT NULL,
	player1score INTEGER,
	player2score INTEGER,
	user_id INTEGER,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(user_id) REFERENCES users(id)
  );
`)

export default fp(async (fastify, opts) => {

	fastify.decorate('db', db);

	fastify.decorate('getUserByEmail', getUserByEmail);
	fastify.decorate('getUserByID', getUserByID);
	fastify.decorate('addUser', addUser);
	fastify.decorate('updateUser', updateUser);


	fastify.addHook('onClose', (instance, done) => {
		db.close();
		done();
	});

	fastify.log.info('Connected to database.');
});