import { FastifyInstance } from "fastify";
import { findQuestion, createQuestion, findQuestionsByProvince, toggleFavorite, getMyFavorites } from "../controllers/question.controller";

// 定义路由参数接口
interface IProvinceParams {
  province: string;
}


export async function questionRoutes(fastify: FastifyInstance) {
  fastify.get('/', { onRequest: [] }, (request, reply) => {
    reply.send('Hello World!');
  });

  // 获取收藏列表 (建议放在最前面或特定路径，避免被 :id 匹配)
  fastify.get('/favorites/mine', getMyFavorites);

  // 收藏/取消收藏题目
  fastify.post('/favorite', toggleFavorite);

  // 获取指定题目详情
  fastify.get('/:id', findQuestion); // 使用修正后的函数名

  // 根据省份/单位获取最近三年的题目列表
  fastify.get('/province/:province', findQuestionsByProvince); // 使用修正后的函数名

  // 创建新题目
  fastify.post('/', createQuestion);
  // fastify.put('/:id', updateQuestion);
}
