// src/plugins/jwt.ts
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';

export default fp(async (fastify) => {
  // 注册 JWT 插件
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET!, // 密钥
    sign: { expiresIn: '15m' }, // accessToken 15 分钟过期
  });

  // 注册 Cookie 插件（用于 refreshToken）
  fastify.register(cookie, {
    secret: process.env.COOKIE_SECRET!, // Cookie 加密密钥
    hook: 'onRequest', // 在请求时解析 Cookie
  });
});
