const fastify = require("fastify")({ logger: true });
const mongoose = require("mongoose");
const cors = require("@fastify/cors");  // 更改这里
import { initRedis } from "./libs/redis";

require("dotenv").config();

// 引入路由
import { userRoutes } from "./routes/user.routes";
import { questionRoutes } from "./routes/question.routes";
// 连接数据库
mongoose.connect(process.env.MONGO_URI as string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Database connected");
}).catch((err: any) => {
  console.log(err);
});

// 注册
const routeConfig = {
  prefix: "/api/v1",
};


async function start() {

  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGO_URI as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // 连接 Redis
    console.log("Redis connecting...");
    await initRedis(fastify);

    // 跨域
    await fastify.register(cors, {  // 更改这里
      origin: "*",
      methods: ["GET", "PUT", "POST", "DELETE"],
    });
    // 注册路由
    fastify.register(userRoutes, { prefix: `${routeConfig.prefix}/user` });  // 前缀为 /user );
    fastify.register(questionRoutes, { prefix: `${routeConfig.prefix}/question` });  // 前缀为 /question


    // 监听端口
    await fastify.listen({ port: 3001, host: "0.0.0.0" });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);

    console.log(`Server listening on ${fastify.server.address().port}`);

  }
  catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
