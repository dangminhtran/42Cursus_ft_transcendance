import { db, GameResult } from './index'

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

export const getResultsByUserID = (user_id: number): GameResult[] => {
	const stmt = db.prepare(`
		SELECT *
		FROM game_results
		WHERE user_id = ?
		ORDER BY created_at DESC
	`);
	return stmt.all(user_id) as GameResult[];
};
