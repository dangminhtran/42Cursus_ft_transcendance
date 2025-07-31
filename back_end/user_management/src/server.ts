import Fastify from 'fastify';
import fastifyFormbody from '@fastify/formbody';
import cors from '@fastify/cors'
import fastifyMetrics from 'fastify-metrics';
import jwtPlugin from './jwt';
import { userRoutes } from './routes/users';
import dbServiceClient from './plugins/dbServiceClient';
import { friendRoutes } from './routes/friends';

const fastify = Fastify({ logger: true });
fastify.register(cors, {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    console.log(`CORS request from origin: ${origin}`);

    callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: '*'
});

fastify.register(dbServiceClient, {
	baseURL: process.env.DATABASE_URL as string,
	tokenHeader: 'authorization'
})


fastify.register(fastifyMetrics, {
  endpoint: '/metrics',
  routeMetrics: {}
});

fastify.register(fastifyFormbody);
fastify.register(jwtPlugin);

fastify.register(userRoutes, { prefix: '/user-management' });
fastify.register(friendRoutes, { prefix: '/friends' });

// Démarrer serveur
fastify.listen({ port: 3002 , host: '0.0.0.0'}, (err: any, address: any) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`User-management service running on ${address}`);
});


/* 
	routes
	POST /profile : return user by email OK
	
	POST /update : update user informations OK

	POST /linkfriends : link friends with friends
	POST /unlinkfriends : unlink friends
*/