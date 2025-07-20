import { FastifyInstance } from 'fastify';
import { User } from '../database/db';
import bcrypt from "bcrypt";


export default async function authRoutes(fastify: FastifyInstance) {

    // -- REGISTER simple (sans hash, juste pour exemple)
    fastify.post('/register', async (request, reply) => {
        const { email, password } = request.body as { email: string, password: string };
        let user: User | null = await fastify.getUserByEmail(email);
		if (user != null)
			return {"message": "Email already used. Please login."};
        let status: boolean = await fastify.addUser(email, password);
		if (!status)
			return reply.code(401).send({ error: 'Unable to create user.' });

        const token = fastify.jwt.sign({ email });
        return { token };
    });

    // -- LOGIN + issue JWT (sans 2FA)
    fastify.post('/login', async (request, reply) => {
        const { email, password } = request.body as { email: string, password: string };
        const user: User | null = await fastify.getUserByEmail(email);

        if (!user) {
            return reply.code(401).send({ error: 'Identifiants invalides' });
        }

		const match: boolean = await bcrypt.compare(password, user.password);

		if (!match)
			return reply.code(401).send({ error: 'Identifiants invalides' });

        if (user.is2FAEnabled) {
            // Si 2FA activé, demander code TOTP avant de délivrer JWT
            return reply.send({ twoFARequired: true, userId: user.id });
        }
        // Pas de 2FA, on délivre JWT directement
        const token = fastify.jwt.sign({ id: user.id, email: user.email });
        return { token };
    });
}
