import { FastifyInstance } from 'fastify';
import { Tournament } from '../structs';

export default async function tournamentRoutes(fastify: FastifyInstance) {

	fastify.post('/add', async (request, reply) => {
		const { uuid } = request.body as { uuid: string };
        if (uuid.length == 0)
			return reply.code(401).send({ error: 'Unable to create tournament.' });
		let status: boolean = await fastify.createTournament(uuid);
		if (!status)
			return reply.code(401).send({ error: 'Unable to create tournament.' });
		return reply.code(200).send({ message: 'Created tournament.' });
	});
}
