import fastify, { FastifyInstance } from 'fastify';
import { Match, MatchToAdd, User } from '../structs';
import { db } from './db'
import { getUserByID } from './users';

export const addMatch = async (match: MatchToAdd, userid: number): Promise<boolean> => {
	let stmt;
	let result;

	const user: User | null = await getUserByID(userid);
	if (!user)
		return false;

	const stmt_fetch_user = db.prepare(`SELECT * from users where username = ?`);
	const user1: User = stmt_fetch_user.get(match.player1) as User;
	const user2: User = stmt_fetch_user.get(match.player2) as User;

	if (user1.id != userid && user2.id != userid)
	{
		return false;
	}

	
	console.log(match.player1score)

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