import { FastifyInstance } from 'fastify';
import { Match, MatchToAdd } from '../structs';
import { db } from './db'

export const addMatch = async (match: MatchToAdd, userid: number): Promise<boolean> => {
	let stmt;
	let result;

	if (!match.tournament_uuid)
	{
		stmt = db.prepare(`INSERT INTO matchs (player1, player2, player1_score, player2_score, user_id) VALUES (?, ?, ?, ?, ?)`);
		result = stmt.run(match.player1, match.player2, match.player1score, match.player2score, userid)
	}
	else
	{
		stmt = db.prepare(`INSERT INTO matchs (player1, player2, player1_score, player2_score, user_id, tournament_id) VALUES (?, ?, ?, ?, ?, ?)`);
		result = stmt.run(match.player1, match.player2, match.player1score, match.player2score, userid, match.tournament_uuid)
	}
	return result.changes === 1
}

export const getAllMatches = async (userid: number): Promise<Match[]> => {
	const stmt = db.prepare(`SELECT * FROM 'matchs' WHERE user_id IN (SELECT users.id FROM friends INNER JOIN users on friend_id = users.id  WHERE user_id = ?) OR user_id = ?`)
	const rows: Match[] = stmt.all(userid, userid) as Match[];
	return rows;
}