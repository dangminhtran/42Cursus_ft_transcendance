import fp from 'fastify-plugin';
import Database from 'better-sqlite3';
import { getUserByEmail, getUserByID, addUser, updateUser, update2FASecret, update2FAEnabled } from './users';
import { AddFriend, DeleteFriend, FetchFriends } from './friends';
import { createTournament } from './tournament';
import { addMatch, getAllMatches, getWinCount } from './match';

export const db = new Database('./transcendence.db', { verbose: console.log });

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	username TEXT,
	profilepicture TEXT,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	is2FAEnabled INTEGER DEFAULT 0,
	twoFASecret TEXT,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`CREATE TABLE IF NOT EXISTS tournaments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS matchs (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	player1 TEXT NOT NULL,
	player2 TEXT NOT NULL,
	player1_score INTEGER,
	player2_score INTEGER,
	user_id INTEGER references users(id),
	tournament_id TEXT REFERENCES tournaments(uuid),
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
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
`);

export default fp(async (fastify, opts) => {

	fastify.decorate('db', db);

	fastify.decorate('getUserByEmail', getUserByEmail);
	fastify.decorate('getUserByID', getUserByID);
	fastify.decorate('addUser', addUser);
	fastify.decorate('updateUser', updateUser);
	fastify.decorate('update2FASecret', update2FASecret);
	fastify.decorate('update2FAEnabled', update2FAEnabled);

	// friends
	fastify.decorate('AddFriend', AddFriend);
	fastify.decorate('DeleteFriend', DeleteFriend);
	fastify.decorate('FetchFriends', FetchFriends);
	fastify.decorate('getWinCount', getWinCount);

	// tournament
	fastify.decorate('createTournament', createTournament);

	// match
	fastify.decorate('addMatch', addMatch);
	fastify.decorate('getAllMatches', getAllMatches);


	fastify.addHook('onClose', (instance, done) => {
		db.close();
		done();
	});

	fastify.log.info('Connected to database.');
});
