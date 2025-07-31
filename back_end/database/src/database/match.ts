import { FastifyInstance } from 'fastify';
import { Match } from '../structs';

export default async function matchRoutes(fastify: FastifyInstance) {

	fastify.post('/add', async (request, reply) => {
		const { uuid } = request.body as { uuid: string };
		let status: boolean = await fastify.createTournament(uuid);
		if (!status)
			return reply.code(401).send({ error: 'Unable to create match.' });
		return reply.code(200).send({ message: 'Match added to database.' });
	});
}
