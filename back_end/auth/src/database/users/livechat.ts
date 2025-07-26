import { db, ChatMessage } from './index'

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
