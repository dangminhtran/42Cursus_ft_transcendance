import Fastify from 'fastify';
import fastifyFormbody from '@fastify/formbody';
import cors from '@fastify/cors'
import jwtPlugin from './jwt';
import twoFARoutes from './routes/2fa';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import dbConnector from "./database/db";


const fastify = Fastify({ logger: true });
fastify.register(cors, {
  origin: true,
})

fastify.register(fastifyFormbody);
fastify.register(jwtPlugin);
fastify.register(dbConnector);

fastify.register(authRoutes, { prefix: '/auth' });
fastify.register(twoFARoutes, { prefix: '/2fa' });
fastify.register(userRoutes, { prefix: '/2fa' });

// Démarrer serveur
fastify.listen({ port: 3000 , host: '0.0.0.0'}, (err: any, address: any) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Auth service running on ${address}`);
});
