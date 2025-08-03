import { FriendStat, Friend, Match } from '../structs'
import { db } from './db'
import { getAllMatches } from './match'

export const AddFriend = async (userid: number, friendid: number): Promise<boolean> => {
	const stmt = db.prepare(`INSERT INTO friends (user_id, friend_id) VALUES (?, ?)`);
	const result = stmt.run(userid, friendid);
	return result.changes === 1
}

export const DeleteFriend = async (userid: number, friendid: number): Promise<boolean> => {
	const stmt = db.prepare(`DELETE FROM friends WHERE user_id = ? AND friend_id = ?;`);
	const result = stmt.run(userid, friendid);
	return result.changes === 1
}

export const FetchFriends = async (userid: number): Promise<Friend[]> => {
	const stmt = db.prepare('SELECT users.username, users.profilepicture, users.email FROM friends INNER JOIN users on friend_id = users.id  WHERE user_id = ?')
	const rows : Friend[]= stmt.all(userid) as Friend[];
	return rows;
}

export const FriendStats = async (userid: number): Promise<FriendStat[]> => {
	// a checker
	const stmt = db.prepare(`
		SELECT users.username, users.profilepicture, users.email, users.win, users.loss 
		FROM friends
		INNER JOIN users ON friends.friend_id = users.id
		WHERE friends.user_id = ?
	`);

	const matches = await getAllMatches(userid);
	const rows = stmt.all(userid) as FriendStat[];

	for (const friend of rows) {
		let win = 0;
		let loss = 0;

		for (const match of matches) {
			// il a joue ?
			if (match.player1 === friend.username || match.player2 === friend.username) {
				const isPlayer1 = match.player1 === friend.username;
				const isPlayer2 = match.player2 === friend.username;

				if (isPlayer1 && match.player1score > match.player2score) win++;
				else if (isPlayer1 && match.player1score < match.player2score) loss++;
				else if (isPlayer2 && match.player2score > match.player1score) win++;
				else if (isPlayer2 && match.player2score < match.player1score) loss++;
			}
		}

		friend.win = win;
		friend.loss = loss;
	}

	return rows;
}


// SELECT * FROM 'matchs' WHERE user_id IN (SELECT users.id FROM friends INNER JOIN users on friend_id = users.id  WHERE user_id = 1)