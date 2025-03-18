import { FastifyInstance } from "fastify";
import { findQuestion, createQuestion, findQuestionsByProvince } from "../controllers/question.controller";

// 定义路由参数接口
interface IProvinceParams {
  province: string;
}


export async function questionRoutes(app: FastifyInstance) {
  app.get('/', { onRequest: [] }, (request, reply) => {
    reply.send('Hello World!');
  });

  app.get('/:id', findQuestion); // 使用修正后的函数名

  app.get('/province/:province', findQuestionsByProvince); // 使用修正后的函数名

  app.post('/', createQuestion);
  // app.put('/:id', updateQuestion);
}
