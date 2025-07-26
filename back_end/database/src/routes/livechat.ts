import { db } from '../database/db';

export const sendMessage = async (message: string, userId: number): Promise<boolean> => {
	try {
		const stmt = db.prepare(`
			INSERT INTO chats (message, user_id)
			VALUES (?, ?)
		`);
		const info = stmt.run(message, userId);

		return info.changes > 0;
	} catch (error) {
		console.error('Error sending message:', error);
		return false;
	}
};

export type ChatMessage = {
	id: number;
	message: string;
	created_at: string;
	user_id: number | null;
	user_email: string | null;
};

export const readMessages = (): ChatMessage[] => {
	const stmt = db.prepare(`
		SELECT 
			chats.id,
			chats.message,
			chats.created_at,
			users.id AS user_id,
			users.email AS user_email
		FROM chats
		LEFT JOIN users ON users.id = chats.user_id
		ORDER BY chats.created_at ASC
	`);
	return stmt.all() as ChatMessage[];
};
