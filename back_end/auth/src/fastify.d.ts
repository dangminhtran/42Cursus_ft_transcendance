import 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
		getUserByEmail(email: string): Promise<User | null>;
		getUserByID(id: number): Promise<User | null>;
		addUser(email: string, password: string): Promise<boolean>;
		deleteUser(email: string, password: string): Promise<boolean>;
		updateUser(email: string, password: string, data: UpdateUser): Promise<boolean>;
		update2FASecret(id: number, secret: string) : Promise<boolean>;
		update2FAEnabled(id: number) : Promise<boolean>;
    	authenticate: (request: any, reply: any) => Promise<void>;
  }
}