import { FastifyInstance } from 'fastify';
import { Friend, User } from '../structs';

export default async function friendsRoutes(fastify: FastifyInstance) {
	fastify.post('/add', async (request, reply) => {
		const { user_id, friend_id } = request.body as { user_id: number, friend_id: number };
		let status: boolean = await fastify.AddFriend(user_id, friend_id);
		if (!status)
			return reply.code(401).send({ error: 'Unable to add friend.' });
		return reply.code(200).send({ message: 'Friend link created.' });
	});

	fastify.post('/delete', async (request, reply) => {
		const { user_id, friend_id } = request.body as { user_id: number, friend_id: number };

		let status: boolean = await fastify.DeleteFriend(user_id, friend_id);
		if (!status)
			return reply.code(401).send({ error: 'Unable to delete friend.' });
		return reply.code(200).send({ message: 'Friend link deleted.' })
	});

	fastify.post('/fetch', async (request, reply) => {
		const { user_id } = request.body as { user_id: number };
		const users: Friend[] = await fastify.FetchFriends(user_id);
		return reply.code(200).send(users);
	});
}
