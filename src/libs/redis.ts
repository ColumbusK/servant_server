// src/lib/redis.ts
import { createClient, RedisClientType } from 'redis';
import { FastifyInstance } from 'fastify';
require("dotenv").config();


// 类型定义增强
declare module 'fastify' {
  interface FastifyInstance {
    redis: RedisClientType<any, any, any>;  // 使用更通用的类型定义
  }
}

// 封装 Redis 客户端
export const initRedis = async (app: FastifyInstance) => {
  console.log("initRedis connecting...");


  const redis = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
    }
  });

  // 连接 Redis
  await redis.connect();


  // 连接成功
  redis.on('connect', () => {
    app.log.info('Redis connected');
  });
  // 挂载到 Fastify 实例
  app.decorate('redis', redis);

  // 错误监听
  redis.on('error', (err) => {
    app.log.error(`Redis error: ${err.message}`);
  });

  // 关闭时清理
  app.addHook('onClose', async () => {
    await redis.quit();
  });

  return redis;
};

// 快捷访问方法封装
export const redisHelpers = {
  setCode: async (app: FastifyInstance, phone: string, code: string) => {
    console.log("app.redis", app.redis, typeof (app.redis));

    await app.redis.set(`sms:${phone}`, code, {
      EX: 300  // 过期时间设置为300秒
    });
  },
  getCode: async (app: FastifyInstance, phone: string) => {
    return await app.redis.get(`sms:${phone}`);
  },
  delCode: async (app: FastifyInstance, phone: string) => {
    await app.redis.del(`sms:${phone}`);
    console.log();

  }
};

