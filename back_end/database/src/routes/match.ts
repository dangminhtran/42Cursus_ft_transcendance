import { FastifyInstance } from 'fastify';
import { MatchToAdd } from '../structs';

export default async function matchRoutes(fastify: FastifyInstance) {

	/*
	POST /match/add/:userid
	{
		"match": {
			"player1": "romainlebg",
			"player2": "xavierneuille",
			"player1score": 5,
			"player2score": 2
		}
	}
	*/
	fastify.post('/add/:userid', async (request, reply) => {
		const { match } = request.body as { match: MatchToAdd };
		const { userid } = request.params as {userid: number};

		if ( !match.player1 || !match.player2 || match.player1score < 0 || match.player2score < 0)
		{
			console.log("LA BARRRE")
			return reply.code(500).send({ message: 'Invalid body.' });
		}

		const result: boolean = await fastify.addMatch(match, userid);
		if (!result)
			return reply.code(500).send({ error: 'Can\'t add match to database'});

		return reply.code(200).send({ message: 'Match added to database.' });
	});

	fastify.post('/getAllMatches', async (request, reply) => {
		const { user_id } = request.body as { user_id: number };

		const result = await fastify.getAllMatches(user_id);
		return result;
	})
}


// /getAllMatches -> GET MY MATCHES + FRIENDS
