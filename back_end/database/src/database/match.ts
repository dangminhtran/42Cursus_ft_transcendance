import fastify, { FastifyInstance } from 'fastify';
import { Match, MatchToAdd, User } from '../structs';
import { db } from './db'
import { getUserByID } from './users';

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
	//const stmt = db.prepare(`SELECT * FROM 'matchs' WHERE user_id IN (SELECT users.id FROM friends INNER JOIN users on friend_id = users.id  WHERE user_id = ?) OR user_id = ?`)

	const user: User | null = await getUserByID(userid);
	if (!user || !user.username)
		return [];
	const stmt = db.prepare(`SELECT * FROM 'matchs' 
		WHERE player1 IN (SELECT users.username FROM friends INNER JOIN users on friend_id = users.id WHERE username = ?) 
		OR player2 IN (SELECT users.username FROM friends INNER JOIN users on friend_id = users.id WHERE username = ?)`)
	const rows: Match[] = stmt.all(user.username, user.username) as Match[];
	return rows;
}