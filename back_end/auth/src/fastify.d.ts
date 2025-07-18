import 'fastify';
import type { Database } from 'better-sqlite3';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<void>;
    db: Database;
  }
}