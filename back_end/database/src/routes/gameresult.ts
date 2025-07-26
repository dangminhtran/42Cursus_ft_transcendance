import { db } from '../database/db';

export const addGameResult = (
	player1: string,
	player2: string,
	player1score: number,
	player2score: number,
	user_id: number
): boolean => {
	try {
		const stmt = db.prepare(`
			INSERT INTO game_results (player1, player2, player1score, player2score, user_id)
			VALUES (?, ?, ?, ?, ?)
		`);
		const info = stmt.run(player1, player2, player1score, player2score, user_id);
		return info.changes > 0;
	} catch (err) {
		console.error('Failed to add game result:', err);
		return false;
	}
};

export type GameResult = {
	id: number;
	player1: string;
	player2: string;
	player1score: number;
	player2score: number;
	user_id: number;
	created_at: string;
};

export const getResultsByUserID = (user_id: number): GameResult[] => {
	const stmt = db.prepare(`
		SELECT *
		FROM game_results
		WHERE user_id = ?
		ORDER BY created_at DESC
	`);
	return stmt.all(user_id) as GameResult[];
};

fastify.get('/tournament/results', async (request, reply) => {
	const { user_id } = request.query as { user_id?: string };

	if (!user_id)
		return reply.code(400).send({ error: 'Missing user_id query parameter' });

	const results = getResultsByUserID(Number(user_id));
	return reply.send(results);
});