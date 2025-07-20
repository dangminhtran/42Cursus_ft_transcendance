import 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
		db: Database.Database;
		getUserByEmail(email: string): Promise<User | null>;
		addUser(email: string, password: string): Promise<boolean>;
    	authenticate: (request: any, reply: any) => Promise<void>;
  }
}