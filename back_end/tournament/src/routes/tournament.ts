import fastifyFormbody from '@fastify/formbody';
import { FastifyInstance } from 'fastify';
import { Tournament, Match } from '../structs';
import { v4 as uuidv4 } from 'uuid';

export async function tournamentRoutes(fastify: FastifyInstance) {
	// -- GET User
	fastify.post('/create_tournament', { preValidation: [fastify.authenticate] },  async (request: any, reply) => {
		const uuid = uuidv4();
		const result: boolean = await fastify.dbClient.post<boolean>('/tournament/add', {uuid: uuid })
		if (!result)
			return reply.code(500).send({ error: 'Cannot create tournament.' });
		return reply.code(200).send({ message: 'Tournament created' });
	});
}