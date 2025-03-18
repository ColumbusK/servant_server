import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";
import fjwt from '@fastify/jwt';
require('dotenv').config();

// 扩展 FastifyInstance 类型
declare module 'fastify' {
  interface FastifyInstance {
    jwtAuth: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export default fp(async function (fastify, opts) {
  await fastify.register(fjwt, {
    secret: process.env.JWT_SECRET as string
  });

  fastify.decorate("jwtAuth", async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
      console.log(request.user);

    } catch (error) {
      reply.status(401).send({ error: "Unauthorized" });
    }
  });

})
