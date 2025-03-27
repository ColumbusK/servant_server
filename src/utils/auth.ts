// utils/auth.ts
import { FastifyReply } from 'fastify';

export async function generateToken(reply: FastifyReply, userId: string) {
  return await reply.jwtSign({
    userId,
    expiresIn: '7d',
    sign: { iat: Math.floor(Date.now() / 1000) }
  });
}
