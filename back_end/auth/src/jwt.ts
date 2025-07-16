import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fastifyJwt from '@fastify/jwt';
import fp from 'fastify-plugin';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

const jwtPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {

    fastify.register(fastifyJwt, {
        secret: JWT_SECRET,
    });

    // Middleware pour protéger routes et récupérer user via JWT
    fastify.decorate("authenticate", async (request: any, reply: any) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });
}

export default fp(jwtPlugin);