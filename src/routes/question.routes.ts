import { FastifyInstance } from "fastify";
import { findQuestion, createQuestion, findQuestionsByProvince, toggleFavorite, getMyFavorites, checkFavorite } from "../controllers/question.controller";
import { getAnswerByQuestionId, saveUserAnswer, getLatestUserAnswer } from "../controllers/answer.controller";
import { setUserInterviewDate } from "../controllers/user.controller";

// 定义路由参数接口
interface IProvinceParams {
  province: string;
}


export async function questionRoutes(fastify: FastifyInstance) {
  fastify.get('/', { onRequest: [] }, (request, reply) => {
    reply.send('Hello World!');
  });
  // 收藏/取消收藏题目
  fastify.post('/favorite', toggleFavorite);

  // 获取收藏列表 (建议放在最前面或特定路径，避免被 :id 匹配)
  fastify.get('/favorites/mine', getMyFavorites);

  // 检查收藏
  fastify.get('/favorite/:questionId', checkFavorite);

  // 获取指定题目的参考答案
  // 访问路径: GET /api/v1/question/67c50bbc9ca1f4313337f522/answer
  fastify.get('/answer/:questionId', getAnswerByQuestionId);

  // 保存用户答案
  fastify.post('/user-answer', saveUserAnswer);

  // 获取用户答案
  fastify.get('/user-answer', getLatestUserAnswer);

  // 获取指定题目详情
  fastify.get('/:id', findQuestion); // 使用修正后的函数名

  // 根据省份/单位获取最近三年的题目列表
  fastify.get('/province/:province', findQuestionsByProvince); // 使用修正后的函数名

  // 创建新题目
  fastify.post('/', createQuestion);
  // fastify.put('/:id', updateQuestion);

  // 设置/更新面试时间
  fastify.put('/interview-date', setUserInterviewDate);
}
