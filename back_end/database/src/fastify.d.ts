import 'fastify';
import { ChatMessage, GameResult } from './src/structs';

declare module 'fastify' {
  interface FastifyInstance {
		// usermanagment && user
		getUserByEmail(email: string): Promise<User | null>;
		getUserByID(id: number): Promise<User | null>;
		addUser(email: string, password: string): Promise<boolean>;
		updateUser(user: User): Promise<boolean>;
		// livechat
		addMessage(userid: number, message: string): Promise<boolean>;
		readMessages(): Promise<ChatMessage[]>;
		// gameresult
		getResultsByUserID(id: number): Promise<GameResult[]>;
		addGameResult(player1: string, player2: string, player1score: number, player2score: number, user_id: number): Promise<boolean>;
  }
}