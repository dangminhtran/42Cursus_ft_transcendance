import Fastify from 'fastify';
import fastifyFormbody from '@fastify/formbody';
import cors from '@fastify/cors'
import fastifyMetrics from 'fastify-metrics';
import jwtPlugin from './jwt';
import { userRoutes } from './routes/users';
import dbServiceClient from './plugins/dbServiceClient';

const fastify = Fastify({ logger: true });
fastify.register(cors, {
  origin: true,
})

fastify.register(dbServiceClient, {
	baseURL:    "http://127.0.0.1:3001/", //process.env.DB_SERVICE_URL!,
	tokenHeader: 'authorization'
})

fastify.register(fastifyMetrics, {
  endpoint: '/metrics',
  routeMetrics: {}
});

fastify.register(fastifyFormbody);
fastify.register(jwtPlugin);

fastify.register(userRoutes, { prefix: '/user-managment' });

// Démarrer serveur
fastify.listen({ port: 3002 , host: '0.0.0.0'}, (err: any, address: any) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`User-managment service running on ${address}`);
});


/* 
	routes
	POST /profile : return user by email OK
	
	POST /update : update user informations OK

	POST /linkfriends : link friends with friends
	POST /unlinkfriends : unlink friends
*/