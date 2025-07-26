import 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
		getUserByEmail(email: string): Promise<User | null>;
		getUserByID(id: number): Promise<User | null>;
		addUser(email: string, password: string): Promise<boolean>;
		updateUser(user: User): Promise<boolean>;
  }
}