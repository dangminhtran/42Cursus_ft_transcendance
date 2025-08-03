import { FastifyInstance } from 'fastify';
import { User } from '../structs';

export default async function authRoutes(fastify: FastifyInstance) {

	fastify.post('/register', async (request, reply) => {
		const { email, username, password } = request.body as { email: string, username: string, password: string };
		let status: boolean = await fastify.addUser(email, username, password);
		if (!status)
			return reply.code(401).send({ error: 'Unable to create user.' });
		return reply.code(200).send({ message: 'Created user.' });
	});

	fastify.post('/login', async (request, reply) => {
		const { email } = request.body as { email: string, password: string };
		const user: User | null = await fastify.getUserByEmail(email);

		if (!user) {
			return reply.code(401).send({ error: 'Identifiants invalides' });
		}

		return user;
	});
}
