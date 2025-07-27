import { ChatMessage } from '../structs';
import { db } from './db'

export const addMessage = async (userid: number, message: string): Promise<boolean> => {
	const stmt = db.prepare(`INSERT INTO chats (message, user_id) VALUES (?, ?)`);
	const info = stmt.run(message, userid)
	return info.changes === 1
}

export const readMessages = async (): Promise<ChatMessage[]> => {
	const stmt = db.prepare(`
		SELECT chats.id, message, users.email 
		FROM 'chats' INNER JOIN users ON users.id = chats.user_id
		ORDER BY chats.id
	`);

	const rows: ChatMessage[] = stmt.all() as ChatMessage[];
	return rows;
}
