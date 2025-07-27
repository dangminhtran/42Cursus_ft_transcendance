import { FastifyInstance } from 'fastify';

export default async function gameResultRoutes(fastify: FastifyInstance) {

	fastify.post('/results', async (request, reply) => {
		const { user_id } = request.body as { user_id?: number };

		if (!user_id)
			return reply.code(400).send({ error: 'Missing user_id query parameter' });

		const results = await  fastify.getResultsByUserID(user_id);
		return reply.send(results);
	});

	fastify.post('/add', async (request, reply) => {
		const {
			player1,
			player2,
			player1score,
			player2score,
			user_id,
		} = request.body as {
			player1?: string;
			player2?: string;
			player1score?: number;
			player2score?: number;
			user_id?: number;
		};

		// Validation simple
		if (
			!player1 || !player2 ||
			player1score === undefined || player2score === undefined ||
			user_id === undefined
		) {
			return reply.code(400).send({ error: 'Missing required fields' });
		}

		const success = await fastify.addGameResult(
			player1,
			player2,
			player1score,
			player2score,
			user_id
		);

		if (success)
			return reply.code(201).send({ message: 'Game result added' });
		else
			return reply.code(500).send({ error: 'Failed to add game result' });
	});

}
