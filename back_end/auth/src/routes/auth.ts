// import { FastifyInstance } from 'fastify';
// import { usersDb } from "../mock_db/db";


// export default async function authRoutes(fastify: FastifyInstance) {

//     // -- REGISTER simple (sans hash, juste pour exemple)
//     fastify.post('/register', async (request, reply) => {
//         const { email, password } = request.body as { email: string, password: string };
//         if ([...usersDb.values()].find(u => u.email === email)) {
//             return reply.code(400).send({ error: 'Email déjà utilisé' });
//         }
//         const id = Math.random().toString(36).substring(2, 10);
//         usersDb.set(id, { id, email, password, is2FAEnabled: false });

//         const token = fastify.jwt.sign({ id, email });
//         return { id, email, token };
//     });



//     // -- LOGIN + issue JWT (sans 2FA)
//     fastify.post('/login', async (request, reply) => {
//         const { email, password } = request.body as { email: string, password: string };
//         const user = [...usersDb.values()].find(u => u.email === email && u.password === password);
//         if (!user) {
//             return reply.code(401).send({ error: 'Identifiants invalides' });
//         }
//         if (user.is2FAEnabled) {
//             // Si 2FA activé, demander code TOTP avant de délivrer JWT
//             return reply.send({ twoFARequired: true, userId: user.id });
//         }
//         // Pas de 2FA, on délivre JWT directement
//         const token = fastify.jwt.sign({ id: user.id, email: user.email });
//         return { token };
//     });
// }


import { FastifyInstance } from 'fastify';
import { randomUUID } from 'crypto';

export default async function authRoutes(fastify: FastifyInstance) {

  // -- REGISTER (avec base SQLite)
  fastify.post('/register', async (request, reply) => {
    const { email, password } = request.body as { email: string, password: string };

    const existingUser = fastify.db.prepare(`SELECT id FROM users WHERE email = ?`).get(email);
    if (existingUser) {
      return reply.code(400).send({ error: 'Email déjà utilisé' });
    }

    const id = randomUUID();

    const stmt = fastify.db.prepare(`
      INSERT INTO users (id, email, password, is2FAEnabled, twoFASecret)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(id, email, password, 0, null);

    const token = fastify.jwt.sign({ id, email });
    return { id, email, token };
  });

  // -- LOGIN (vérifie la DB SQLite)
  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body as { email: string, password: string };

    const stmt = fastify.db.prepare(`SELECT * FROM users WHERE email = ? AND password = ?`);
    const user = stmt.get(email, password) as
      | { id: string; email: string; password: string; is2FAEnabled: number; twoFASecret?: string }
      | undefined;

    if (!user) {
      return reply.code(401).send({ error: 'Identifiants invalides' });
    }

    if (user.is2FAEnabled) {
      return reply.send({ twoFARequired: true, userId: user.id });
    }

    const token = fastify.jwt.sign({ id: user.id, email: user.email });
    return { token };
  });
}
