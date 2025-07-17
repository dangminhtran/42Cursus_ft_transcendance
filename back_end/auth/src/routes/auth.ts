import { FastifyInstance } from 'fastify';
import { usersDb } from "../mock_db/db";


export default async function authRoutes(fastify: FastifyInstance) {

    // -- REGISTER simple (sans hash, juste pour exemple)
    fastify.post('/register', async (request, reply) => {
        const { email, password } = request.body as { email: string, password: string };
        if ([...usersDb.values()].find(u => u.email === email)) {
            return reply.code(400).send({ error: 'Email déjà utilisé' });
        }
        const id = Math.random().toString(36).substring(2, 10);
        usersDb.set(id, { id, email, password, is2FAEnabled: false });

        const token = fastify.jwt.sign({ id, email });
        return { id, email, token };
    });



    // -- LOGIN + issue JWT (sans 2FA)
    fastify.post('/login', async (request, reply) => {
        const { email, password } = request.body as { email: string, password: string };
        const user = [...usersDb.values()].find(u => u.email === email && u.password === password);
        if (!user) {
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
