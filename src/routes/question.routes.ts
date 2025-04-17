import { FastifyInstance } from "fastify";
import { findQuestion, createQuestion, findQuestionsByProvince } from "../controllers/question.controller";

// 定义路由参数接口
interface IProvinceParams {
  province: string;
}


export async function questionRoutes(fastify: FastifyInstance) {
  fastify.get('/', { onRequest: [] }, (request, reply) => {
    reply.send('Hello World!');
  });

  fastify.get('/:id', findQuestion); // 使用修正后的函数名

  fastify.get('/province/:province', findQuestionsByProvince); // 使用修正后的函数名

  fastify.post('/', createQuestion);
  // fastify.put('/:id', updateQuestion);
}
