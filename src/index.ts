import Fastify from 'fastify'
import mongoose from 'mongoose';
// const cors = require("@fastify/cors");  // 更改这里
import cors from "@fastify/cors"
import { initRedis } from "./libs/redis";

require("dotenv").config();
import { envToLogger } from './utils/logger';

// 插件
import jwtPlugin from "./plugins/jwtPlugin";
import signaturePlugin from './plugins/signaturePlugin';

// 引入路由
import { userRoutes } from "./routes/user.routes";
import { questionRoutes } from "./routes/question.routes";

// Instantiate the framework
const fastify = Fastify({
  logger: envToLogger[process.env.NODE_ENV || 'development'] ?? true
})

// Register parent error handler
fastify.setErrorHandler((error, request, reply) => {
  // 记录错误
  fastify.log.error(error);

  // 根据错误类型返回不同的状态码
  const statusCode = error.statusCode || 500;

  reply.status(statusCode).send({
    ok: false,
    error: {
      message: error.message || '服务器内部错误',
      statusCode,
    }
  });
})

// 注册
const routeConfig = {
  prefix: "/api/v1",
};


async function start() {

  try {
    // 连接数据库
    const mongo = await mongoose.connect(process.env.MONGO_URI as string);
    if (mongo) {
      console.log("MongoDB connected");
    }
    // 连接 Redis
    console.log("Redis connecting...");
    const red = await initRedis(fastify);
    if (red) {
      console.log("Redis connected");
    }

    // 1. 注册基础插件
    await fastify.register(cors, {  // 更改这里
      origin: "*",
      methods: ["GET", "PUT", "POST", "DELETE"],
    });
    await fastify.register(require('@fastify/sensible'));



    // 2. 注册自定义插件
    //  JWT 插件
    await fastify.register(jwtPlugin);
    // 签名插件
    await fastify.register(signaturePlugin);


    // 3. 创建一个顶级路由来处理所有 API 路由
    await fastify.register(async function (instance) {
      // 注册用户路由
      await instance.register(userRoutes, {
        prefix: '/user'
      });

      // 注册问题路由，并添加认证
      await instance.register(async function (protectedRoutes) {
        protectedRoutes.addHook('onRequest', protectedRoutes.jwtAuth);
        // onSend 对所有question路由下 全部响应内容进行jwt加密
        // protectedRoutes.addHook('onSend', (request, reply, payload, next) => {
        //   if (request.raw.url.includes('/question')) {
        //     reply.header('Content-Type', 'application/json');
        //     payload.data = fastify.jwt.sign(payload.data);
        //   }
        //   next();
        // });

        // 注册问题路由
        await protectedRoutes.register(questionRoutes, { prefix: '/question' });

        await protectedRoutes.register(questionRoutes);
      }, { prefix: '/question' });

    }, { prefix: routeConfig.prefix });


    // 监听端口
    fastify.listen({ port: 3001, host: "0.0.0.0" }, function (err, address) {
      if (err) {
        fastify.log.error(err)
        process.exit(1)
      }
      fastify.log.info(`server listening on ${address}`)
    });



  }
  catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
