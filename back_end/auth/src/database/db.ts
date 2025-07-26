import fp from 'fastify-plugin';
import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import { addUser, deleteUser, getUserByEmail, getUserByID, update2FASecret, updateUser } from './users/users';

export const db = new Database('./transcendence.db', { verbose: console.log });

export default fp(async (fastify, opts) => {

	fastify.decorate('db', db);

	fastify.decorate('getUserByEmail', getUserByEmail);
	fastify.decorate('getUserByID', getUserByID);
	fastify.decorate('addUser', addUser);
	fastify.decorate('deleteUser', deleteUser);
	fastify.decorate('updateUser', updateUser);
	fastify.decorate('update2FASecret', update2FASecret);

	fastify.addHook('onClose', (instance, done) => {
		db.close();
		done();
	});

	fastify.log.info('Connected to database.');
});
