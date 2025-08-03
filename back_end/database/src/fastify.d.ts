import 'fastify';
import { ChatMessage, GameResult } from './structs';

declare module 'fastify' {
  interface FastifyInstance {
		// usermanagment && user
		getUserByEmail(email: string): Promise<User | null>;
		getUserByID(id: number): Promise<User | null>;
		addUser(email: string, password: string): Promise<boolean>;
		updateUser(user: User): Promise<boolean>;
		update2FASecret(userid: number, twoFASecret: string): Promise<boolean>;
		update2FAEnabled(userid: number): Promise<boolean>;

		// livechat
		addMessage(userid: number, message: string): Promise<boolean>;
		readMessages(): Promise<ChatMessage[]>;
		// gameresult
		getResultsByUserID(id: number): Promise<GameResult[]>;
		addGameResult(player1: string, player2: string, player1score: number, player2score: number, user_id: number): Promise<boolean>;


		// friends
		AddFriend(userid: number, friendid: number): Promise<boolean>;
		DeleteFriend(userid: number, friendid: number): Promise<boolean>;
		FetchFriends(userid: number): Promise<Friend[]>;
		// tournament
		createTournament(uuid: string): Promise<boolean>;
		// match 
		addMatch(match: Match, userid: number): Promise<boolean>;
		getAllMatches(userid: number): Promise<Match[]>;
	}
}