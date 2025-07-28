import Fastify from 'fastify';
import fastifyFormbody from '@fastify/formbody';
import cors from '@fastify/cors'
import fastifyMetrics from 'fastify-metrics';
import authRoutes from './routes/user';
import userManagmentRoutes from './routes/user_managment'
import dbConnector from "./database/db";
import gameResultRoutes from './routes/gameresult';


const fastify = Fastify({ logger: true });
fastify.register(cors, {
  origin: true,
})

fastify.register(fastifyFormbody);

fastify.register(fastifyMetrics, {
  endpoint: '/metrics',
  routeMetrics: {}
});

fastify.register(dbConnector);
fastify.register(authRoutes, { prefix: '/auth' });
fastify.register(userManagmentRoutes, { prefix: '/user' });
fastify.register(gameResultRoutes, { prefix: '/tournament'});

// Démarrer serveur
fastify.listen({ port: 3001 , host: '0.0.0.0'}, (err: any, address: any) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Database service running on ${address}`);
});
