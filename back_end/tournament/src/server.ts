import Fastify from 'fastify';
import fastifyFormbody from '@fastify/formbody';
import cors from '@fastify/cors'
import fastifyMetrics from 'fastify-metrics';
import jwtPlugin from './jwt';
import { matchRoutes } from './routes/match';
import { tournamentRoutes } from './routes/tournament';
import dbServiceClient from './plugins/dbServiceClient';

import net from 'net';

const logstashClient = net.createConnection({ port: 5000, host: 'logstash' });

const fastify = Fastify({
  logger: {
    stream: logstashClient,
    level: 'info',
    timestamp: () => `,"@timestamp":"${new Date().toISOString()}"`,
    formatters: {
      level(label) {
        return { level: label };
      }
    }
  }
});
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
	baseURL: process.env.DATABASE_URL as string || "http://localhost:3001",
	tokenHeader: 'authorization'
})

fastify.register(fastifyMetrics, {
  endpoint: '/metrics',
  routeMetrics: {}
});

fastify.register(fastifyFormbody);
fastify.register(jwtPlugin);

fastify.register(matchRoutes, { prefix: '/match' });
fastify.register(tournamentRoutes, { prefix: '/tournament' });


fastify.listen({ port: 3003 , host: '0.0.0.0'}, (err: any, address: any) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Tournament service running on ${address}`);
});
