import { FastifyInstance } from 'fastify';
import { User } from '../structs'
import bcrypt from "bcrypt";


export default async function authRoutes(fastify: FastifyInstance) {

    // -- REGISTER simple (sans hash, juste pour exemple)
    fastify.post('/register', async (request, reply) => {
        const { email, password } = request.body as { email: string, password: string };
        let user: User | null = await fastify.dbClient.post<User>('/user/getUserByEmail', { email });
		if (user != null)
			return reply.code(409).send({message: "Email already used. Please login."});

		let hash = await bcrypt.hash(password, 10);

        let status: boolean = await fastify.dbClient.post<boolean>('/auth/register', { email: email, password: hash });
		if (!status)
			return reply.code(401).send({ error: 'Unable to create user.' });
		
		let dbUser: User | null = await fastify.dbClient.post<User>('/user/getUserByEmail', { email });
		if (!dbUser) {
            return reply.code(500).send({ error: 'Identifiants invalides' });
        }
        const token = fastify.jwt.sign({  id: dbUser.id, email: dbUser.email  });
        return { token };
    });

    // -- LOGIN + issue JWT (sans 2FA)
    fastify.post('/login', async (request, reply) => {
        const { email, password } = request.body as { email: string, password: string };
        const user: User | null = await fastify.dbClient.post<User>('/user/getUserByEmail', { email });

        if (!user) {
            fastify.log.warn(`Unauthorized: User trying to login with non-existing email: ${email}`);
            return reply.code(401).send({ error: 'Identifiants invalides' });
        }

		const match: boolean = await bcrypt.compare(password, user.password);

		if (!match) {
			fastify.log.warn(`Unauthorized: User trying to login with incorrect password: ${email}`);
			return reply.code(401).send({ error: 'Identifiants invalides' });
        }

        if (user.is2FAEnabled) {
            // Si 2FA activé, demander code TOTP avant de délivrer JWT
            return reply.send({ twoFARequired: true, userId: user.id });
        }
        // Pas de 2FA, on délivre JWT directement
        const token = fastify.jwt.sign({ id: user.id, email: user.email });
        return { token };
    });
}
