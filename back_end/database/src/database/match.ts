import { FastifyInstance } from 'fastify';
import { Match } from '../structs';
import { db } from './db'

// Type de match reçu
interface MatchInput {
  player1: string;
  player2: string;
  score1: number;
  score2: number;
  tournamentId: number; // id INTEGER
}

export const AddMatch = (
  player1: string,
  player2: string,
  score1: number,
  score2: number,
  tournamentId: number
): boolean => {
  try {
    const stmt = db.prepare(`
      INSERT INTO matchs (player1, player2, player1_score, player2_score, tournament_id)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(player1, player2, score1, score2, tournamentId);

    return true;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du match:', error);
    return false;
  }
};

export default async function matchRoutes(fastify: FastifyInstance) {

	fastify.post('/add', async (request, reply) => {
		const { uuid } = request.body as { uuid: string };
		let status: boolean = await fastify.createTournament(uuid);
		if (!status)
			return reply.code(401).send({ error: 'Unable to create match.' });
		return reply.code(200).send({ message: 'Match added to database.' });
	});

	fastify.post('/match', async (request, reply) => {
		const { player1, player2, score1, score2, tournamentId } = request.body as MatchInput;

		const success = fastify.AddMatch(player1, player2, score1, score2, tournamentId);

		if (success) {
			reply.code(201).send({ message: 'Match enregistré avec succès.' });
		} else {
			reply.code(500).send({ error: 'Erreur lors de l\'enregistrement du match.' });
		}
	});
}
