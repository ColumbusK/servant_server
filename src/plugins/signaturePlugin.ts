// src/auth/signaturePlugin.ts
import fp from 'fastify-plugin';
import crypto from 'crypto';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { redisHelpers } from '../libs/redis';


export default fp(async (fastify: FastifyInstance) => {

  fastify.addHook('preHandler', async (req: FastifyRequest) => {
    const { 'x-sign-ts': ts, 'x-sign-nonce': nonce, 'x-sign': sign } = req.headers;
    console.log('Signature headers', { ts, nonce, sign });

    // 1. 基础校验
    if (!ts || !nonce || !sign) {
      console.log('Missing signature headers', { ts, nonce, sign });

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
    const urlPath = req.url.split('?')[0]; // 截掉问号后面的内容

    const raw = [
      req.method.toUpperCase(),
      encodeURIComponent(urlPath), // 现在这里是 /api/v1/question/user-answer
      ts,
      nonce,
      req.body ? JSON.stringify(req.body) : '{}',
    ].join('|');

    // 5. 验证签名
    const serverSign = crypto
      .createHmac('sha256', process.env.API_SECRET!)
      .update(raw)
      .digest('hex');
    console.log('服务端签名原始字符串:', raw);
    console.log('服务端生成的签名:', serverSign);
    // 6. 比较签名
    if (serverSign !== sign) {
      throw fastify.httpErrors.unauthorized('Invalid signature');
    }
  });
});
