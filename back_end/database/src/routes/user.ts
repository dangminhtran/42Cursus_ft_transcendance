import { FastifyInstance } from 'fastify';
import { User } from '../structs';

export default async function authRoutes(fastify: FastifyInstance) {

    fastify.post('/register', async (request, reply) => {
		const { email, password } = request.body as { email: string, password: string };
		let status: boolean = await fastify.addUser(email, password);
		if (!status)
			return reply.code(401).send({ error: 'Unable to create user.' });
		return reply.code(201).send({ message: 'Created user.' });
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
