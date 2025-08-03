import fastifyFormbody from '@fastify/formbody';
import { FastifyInstance } from 'fastify';
import { Match, MatchToAdd, User } from '../structs';

export async function matchRoutes(fastify: FastifyInstance) {
	// -- GET User
	fastify.post('/addMatch', { preValidation: [fastify.authenticate] },  async (request: any, reply) => {
		const { match } = request.body as { match: MatchToAdd };
		const userid = request.user.id;

		const result: boolean = await fastify.dbClient.post<boolean>(`/match/add/${userid}`, { match: match });
		if (!result)
			return reply.code(500).send({ error: 'Cannot add match.' });
		return reply.code(200).send({ message: 'Match created' });
	});

	fastify.post('/getAllMatches', { preValidation: [fastify.authenticate] },  async (request: any, reply) => {
		const userid = request.user.id;

		const result: Match[] = await fastify.dbClient.post<Match[]>(`/match/getAllMatches`, { user_id: userid });
		if (!result)
			return reply.code(500).send({ error: 'Cannot add match.' });
		return reply.code(200).send(result);
	});


	// fastify.post('/add/:userid'
	// /getAllMatches
	// fastify.post('/create_tournament', { preValidation: [fastify.authenticate] },  async (request: any, reply) => {
	// 	const uuid = uuidv4();
	// 	const result: boolean = await fastify.dbClient.post<boolean>('/tournament/add', {uuid: uuid })
	// 	if (!result)
	// 		return reply.code(500).send({ error: 'Cannot create tournament.' });
	// 	return reply.code(200).send({ message: 'Tournament created' });
	// });
}