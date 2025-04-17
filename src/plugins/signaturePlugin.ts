// src/auth/signaturePlugin.ts
import fp from 'fastify-plugin';
import crypto from 'crypto';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { redisHelpers } from '../libs/redis';


export default fp(async (fastify: FastifyInstance) => {

  fastify.addHook('preHandler', async (req: FastifyRequest) => {
    const { 'x-sign-ts': ts, 'x-sign-nonce': nonce, 'x-sign': sign } = req.headers;

    // 1. 基础校验
    if (!ts || !nonce || !sign) {
      throw fastify.httpErrors.unauthorized('Missing signature headers');
    }

    // 2. 时间有效性验证（允许±5分钟）
    const timestamp = parseInt(ts as string, 10);
    if (Math.abs(Date.now() - timestamp) > 300_000) {
      throw fastify.httpErrors.unauthorized('Invalid timestamp');
    }

    // 3. 防止重放攻击
    const nonceKey = `nonce:${nonce}`;
    if (await fastify.redis.exists(nonceKey)) {
      throw fastify.httpErrors.unauthorized('Duplicate nonce');
    }
    // redis 插入
    await redisHelpers.setNonce(fastify, nonce as string);


    // 4. 重构签名数据
    const raw = [
      req.method,
      encodeURIComponent(req.url),
      ts,
      nonce,
      req.body ? JSON.stringify(req.body) : ''
    ].join('|');

    // 5. 验证签名
    const serverSign = crypto
      .createHmac('sha256', process.env.API_SECRET!)
      .update(raw)
      .digest('hex');

    if (serverSign !== sign) {
      throw fastify.httpErrors.unauthorized('Invalid signature');
    }
  });
});
