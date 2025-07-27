import { GameResult } from '../structs';
import { db } from './db'

export const addGameResult = async (player1: string, player2: string, player1score: number, player2score: number, user_id: number): Promise<boolean> => {
	const stmt = db.prepare(`INSERT INTO game_results (player1, player2, player1score, player2score, user_id) VALUES (?, ?, ?, ?, ?)`);
	const info = stmt.run(player1, player2, player1score, player2score, user_id)
	return info.changes === 1
}

export const getResultsByUserID = async (id: number): Promise<GameResult[]> => {
	const stmt = db.prepare(`SELECT * FROM game_results ORDER BY id`);

	const rows: GameResult[] = stmt.all() as GameResult[];
	return rows;
}