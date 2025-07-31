import { User, Friend } from '../structs'
import { db } from './db'

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
